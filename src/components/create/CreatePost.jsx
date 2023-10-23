import "./CreatePost.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const CreatePost = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", body: "", category: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleCreate = async () => {
    await axios.post(`${import.meta.env.VITE_SERVER_URL}api/posts`, {
      title: post.title,
      body: post.body,
      category: post.category,
    });

    navigate("/");
  };

  return (
    <div className="updatePage">
      <header className="header">
        <Link to={"/"} className="createPostLink">
          <h4 className="name">HOME</h4>
        </Link>
      </header>
      <section className="update">
        <section>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
          />
        </section>
        <section>
          <label htmlFor="body">Body</label>
          <textarea
            type="text"
            id="body"
            name="body"
            value={post.body}
            onChange={handleChange}
          />
        </section>
        <section>
          <label htmlFor="cat">Category</label>
          <input
            type="text"
            id="cat"
            name="category"
            value={post.category}
            onChange={handleChange}
          />
        </section>
        <button onClick={handleCreate}>Post</button>
      </section>
    </div>
  );
};

export default CreatePost;
