const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require("http");
const axios = require("axios");

const app = express();
const events = [];

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.post('/events', (req, res, next) => {

    console.log("Received event:")
    console.log(req.body);
    events.push(req.body);

    axios.post('http://localhost:4000/events', req.body)
        .catch(e => console.log("could not post event to posts service")) // posts service
    axios.post('http://localhost:4001/events', req.body)
        .catch(e => console.log("could not post event to comments service")) // comments service
    axios.post('http://localhost:4002/events', req.body)
        .catch(e => console.log("could not post event to query service")) // query service
    axios.post('http://localhost:4003/events', req.body)
        .catch(e => console.log("could not post event to comment moderation service")) // comment moderator

    res.sendStatus(200);

});

app.get('/events', (req, res) => {
    res.status(200).send(events)
});

const server = http.createServer(app);

server.listen(4100, () => {
    console.log("MESSAGE BROKER SERVICE is running at http://localhost:4100")
});
