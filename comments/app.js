const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require("http");
const axios = require("axios");
const {randomBytes} = require("crypto")

const app = express();

let comments = {};

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

    switch (req.body.type) {
        case "COMMENT_MODERATION_STATUS_CHANGE":
            console.log("moderate comment", comments);
            console.log(comments[req.body.payload.id]);
            comments[req.body.payload.id] = req.body.payload

            axios.post("http://localhost:4100/events", {type: "COMMENT_UPDATED", payload: comments[req.body.payload.id]})
            break;
        default:
            console.log("Unhandled event:", req.body.type)
    }

    res.status(200).send()

});

app.get('/comments', (req, res, next) => {
    res.status(200).json(comments);
});

app.post('/comments', async (req, res, next) => {

    // add comment to local data store

    let id = randomBytes(5).toString('hex');
    comments[id] = {...req.body, id: id, moderationStatus: "PENDING"};

    // send event to event broker http://localhost:7784
    try {
        await axios.post("http://localhost:4100/events", {type: "COMMENT_ADD", payload: comments[id]})
    } catch {
        console.error('message send failed')
    }

    res.status(200).send(comments[id]);

});

const server = http.createServer(app);

server.listen(4001, () => {
    console.log("COMMENTS SERVICE is running at http://localhost:4001")
});
