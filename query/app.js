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

    handleEvent(req.body);
    res.status(200).send()

});

app.get('/query', (req, res, next) => {

    let filteredPosts = posts.map(post => {

        return {
            ...post,
            comments: comments.filter(comment => comment.pid === post.id)
        }

    });
    res.status(200).send(filteredPosts)

});

const server = http.createServer(app);

server.listen(4002, async () => {

    console.log("QUERY SERVICE is running at http://localhost:4002")

    let events = await axios.get("http://localhost:4100/events");

    for(let i = 0;i<events.data.length;i++) {
        await handleEvent(events.data[i]);
    }

});

async function handleEvent(event) {

    let type = event.type;
    let payload = event.payload;

    switch (type) {
        case "COMMENT_ADD":
            console.log("add comment", comments);
            comments.push(payload);
            break;
        case "POST_ADD":
            console.log("add post", posts);
            posts.push(payload);
            break;
        case "COMMENT_UPDATED":
            console.log("update comment", comments);
            let index = comments.findIndex(comment => comment.id === payload.id);
            comments[index] = payload;
            break;
        default:
            console.log("unhandled event:", type)
    }

    console.log(posts)
    console.log(comments)

}
