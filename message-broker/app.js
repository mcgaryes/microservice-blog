const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require("http");
const axios = require("axios");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.post('/events', async (req, res, next) => {

    console.log("received event:")
    console.log(req.body)

    /*
    Send out events to everyone
        console.log("COMMENTS SERVICE is running at http://localhost:7781")
        console.log("POST SERVICE is running at http://localhost:7782")
        console.log("QUERY SERVICE is running at http://localhost:7783")
    */

    try {
        await axios.post('http://localhost:7781/events', req.body)
    } catch {
        console.log("couldnt send event to comments service");
    }

    try {
        await axios.post('http://localhost:7782/events', req.body)
    } catch {
        console.log("couldnt send event to posts service");
    }

    try {
        await axios.post('http://localhost:7783/events', req.body)
    } catch {
        console.log("couldnt send event to query service");
    }

    res.sendStatus(200);

});

app.get('/', (req, res, next) => {
    res.status(200).send({status: "ok"})
});

const server = http.createServer(app);

server.listen(7784, () => {
    console.log("MESSAGE BROKER SERVICE is running at http://localhost:7784")
});
