const express = require("express");
const app = express();
app.get ("/",async(req,res)=>{
    res.send("Hi there")
});

app.listen(8080,()=>{
    console.log('Lstening on port 8080')
})