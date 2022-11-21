const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require("http");

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
            console.log("add comment", comments);
            comments.push(req.body.payload);
            break;
        case "POST_ADD":
            console.log("add post", posts);
            posts.push(req.body.payload);
            break;
        default:
            console.log("unhandled event:", req.body.type)
    }

    console.log(posts);
    console.log(comments);

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

server.listen(7783, () => {
    console.log("QUERY SERVICE is running at http://localhost:7783")
});
