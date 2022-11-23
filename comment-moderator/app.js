const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require("http");
const axios = require("axios");

const app = express();

let posts = [];
let comments = [];

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
        case "COMMENT_ADD":
            comments.push(req.body.payload);
            console.log(req.body.payload);

            moderateComment(req.body.payload);

            break;
        default:
            console.log("Unhandled event:", req.body.type)
    }

    res.status(200).send()

});

function moderateComment(comment){


    /*
    {
      pid: '85189aaefa',
      comment: 'Comment 4',
      id: '6a3ace9745',
      moderationStatus: 'PENDING'
    }
     */


    axios.post("http://localhost:4100/events", {
        type: "COMMENT_MODERATION_STATUS_CHANGE",
        payload: {
            ...comment,
            moderationStatus: Math.random() > 0.5 ? "APPROVED" : "REJECTED"
        }
    })
}

const server = http.createServer(app);

server.listen(4003, () => {
    console.log("COMMENT MODERATION SERVICE is running at http://localhost:4003")
});
