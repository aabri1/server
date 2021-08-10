//main file when the server runs
const express= require('express');
const http = require ('http');
const bodyParser = require('body-parser');
const morgan = require('morgan'); //logging framework 
const app = express();

const router = require('./router');

//app setup
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'})); //parses incoming request as a json
router(app);

//server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app); //native node library -> go a head an run the application

server.listen(port);
console.log('Server listening on:', port);
