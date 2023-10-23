import { useParams, useNavigate, Link } from "react-router-dom";
import "./Post.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Post = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState({ title: "", body: "", category: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}api/posts/post/${postId}`
      );
      const data = await res.data;
      const { title, body, createdAt, category } = data;
      setPost({
        title,
        body,
        createdAt,
        category,
      });
      setIsLoading(false);
    };
    getPost();
  }, [postId]);

  const deletePost = async () => {
    const res = await axios.delete(
      `${import.meta.env.VITE_SERVER_URL}api/posts/post/${postId}`
    );
    const data = await res.data;
    navigate("/");
    console.log(data);
  };

  if (isLoading)
    return (
      <div className="loading">
        <h3>Loading...</h3>
      </div>
    );
  return (
    <>
      <header className="header">
        <button
          className="name"
          style={{
            cursor: "pointer",
            background: "red",
            borderRadius: "5px",
            fontSize: "1.7rem",
          }}
          onClick={deletePost}
        >
          Delete
        </button>
        <Link
          to={`/`}
          className="createPostLink"
          style={{
            background: "#fff",
            color: "#000",
          }}
        >
          HOME
        </Link>

        <Link
          to={`/post/${postId}/update`}
          className="createPostLink"
          style={{
            background: "green",
            color: "whitesmoke",
          }}
        >
          Update
        </Link>
      </header>
      <article className="postPage">
        {post.category && (
          <>
            / <span className="category">#{post.category.toUpperCase()}</span>
          </>
        )}

        <h3 className="title">{post.title}</h3>
        <p className="body">{post.body}</p>
      </article>
    </>
  );
};

export default Post;
