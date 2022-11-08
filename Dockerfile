FROM node:14-alpine

WORKDIR /usr/app

COPY ./package.json /usr/app
RUN npm install
COPY ./index.js /usr/app/

CMD ["node", "index"]