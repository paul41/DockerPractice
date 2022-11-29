const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {Pool} = require('pg');
const redis = require('redis');
const keys = require('./keys');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
    user:keys.pgUser,
    host:keys.pgHost,
    database:keys.pgDatabase,
    password:keys.pgPassword,
    port:keys.pgPort
});

pgClient.on('error',()=>console.log('Lost PG connection'))
pgClient.on("connect", (client) => {
    client
      .query("CREATE TABLE IF NOT EXISTS values (number INT)")
      .catch((err) => console.error(err));
});

const redisClient = redis.createClient({
    host:keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

//Express route handler

app.get('/',(req,res)=>{
    res.send('Welcome to Multi Docker application')
});
app.get('/values/all', async(req,res)=>{
    const values = await pgClient.query('SELECT * from values')
    res.send(values.rows)
})
app.get('/values/current',async(req,res)=>{
    redisClient.hGetAll('values',(err,val)=>{
        res.send(values)
    })
});
app.post('/values',async(req,res)=>{
    const index = req.body.index;
    if(parseInt(index) > 40){
        return res.status(422).send('Index too high')
    }
    redisClient.hSet('values',index,'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) values($1)', [index]);
    res.send({working:true})
})

app.send(5000,()=>{
    console.log("Running on port 5000")
})