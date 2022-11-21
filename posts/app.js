const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require("http");
const {randomBytes} = require("crypto")
const axios = require("axios");

const app = express();

let posts = {};

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

    console.log("received event:")
    console.log(res.body)
    res.status(200).send()

});

app.get('/posts', (req, res, next) => {
    res.status(200).json(posts);
});

app.post('/posts', async (req, res, next) => {

    // add post to local data store

    let id = randomBytes(5).toString('hex');
    posts[id] = {...req.body, id};

    try {
        await axios.post("http://localhost:7784/events", {type: "POST_ADD", payload: posts[id]})
    } catch {
        console.error('message send failed')
    }

    res.status(200).json(posts[id]);

});

const server = http.createServer(app);

server.listen(7782, () => {
    console.log("POST SERVICE is running at http://localhost:7782")
});
