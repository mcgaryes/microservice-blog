import React, {SyntheticEvent, useCallback, useEffect, useState} from 'react';
import './App.css';
import axios from 'axios'

function App() {

    const [posts, setPosts] = useState<any[]>([])
    const [postTitle, setPostTitle] = useState<string>();
    const [comment, setComment] = useState<string>();

    const createPost = useCallback(() => {

        if (!postTitle || postTitle === "") {
            alert("please enter a post title")
            return;
        }

        axios.post("http://localhost:4000/posts", {title: postTitle})
            .then(() => axios.get("http://localhost:4002/query"))
            .then(res => setPosts(res.data))

    }, [postTitle]);

    const addComment = useCallback((postId: string) => {

        if (!comment || comment === "") {
            alert("please enter a comment")
            return;
        }

        axios.post("http://localhost:4001/comments", {pid: postId, comment})
            .then(() => axios.get("http://localhost:4002/query"))
            .then(res => setPosts(res.data))

    }, [comment]);

    useEffect(() => {

        console.log("query");

        axios.get("http://localhost:4002/query")
            .then(res => {
                setPosts(res.data);
            });

    }, [])

    return (
        <div className="App">
            <main>

                <div className={"post-creator"}>

                    <label>Post Title:</label>
                    <input type={"text"} onChange={(e) => {
                        setPostTitle(e.target.value)
                    }}/>

                    <button onClick={() => createPost()}>Create Post</button>

                </div>

                <ul className={"post-list"}>

                    {
                        posts.map(post => (
                            <li key={post.id} className={"post"}>

                                <h1>{post.title}</h1>

                                <ul className={"comment-list"}>

                                    {
                                        post.comments.map((comment:any) => (

                                            <li key={comment.id} className={"comment"}>
                                                {
                                                    comment.moderationStatus === "PENDING" &&
                                                    <p style={{color: "lightgray"}}>{comment.comment}</p>
                                                }

                                                {
                                                    comment.moderationStatus === "REJECTED" &&
                                                    <p style={{color: "red", textDecoration: "line-through"}}>{comment.comment}</p>
                                                }

                                                {
                                                    comment.moderationStatus === "APPROVED" &&
                                                    <p style={{color: "green"}}>{comment.comment}</p>
                                                }

                                            </li>
                                        ))
                                    }

                                </ul>

                                <form className={"comment-creator"} onSubmit={(e) => {
                                    e.preventDefault();
                                    addComment( post.id)
                                }}>


                                    <label>Add Comment:</label>
                                    <input type={"text"} onChange={(e) => setComment(e.target.value)}/>
                                    <input type="submit" value="Submit"/>

                                </form>

                            </li>
                        ))
                    }

                </ul>

            </main>
        </div>
    );
}

export default App;
