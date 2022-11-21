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

        axios.post("http://localhost:7782/posts", {title: postTitle})
            .then(() => axios.get("http://localhost:7783/query"))
            .then(res => setPosts(res.data))

    }, [postTitle]);

    const addComment = useCallback((e: SyntheticEvent, postId: string) => {

        e.preventDefault();

        if (!comment || comment === "") {
            alert("please enter a comment")
            return;
        }

        axios.post("http://localhost:7781/comments", {pid: postId, comment})
            .then(() => axios.get("http://localhost:7783/query"))
            .then(res => setPosts(res.data))

    }, [comment]);

    useEffect(() => {

        axios.get("http://localhost:7783/query")
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
                                            <li className={"comment"}>
                                                <p>{comment.comment}</p>
                                            </li>
                                        ))
                                    }

                                </ul>

                                <form className={"comment-creator"} onSubmit={(e) => addComment(e, post.id)}>


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
