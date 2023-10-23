import { useEffect, useState } from "react";
import "./Update.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Update = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState({ title: "", body: "", category: "" });

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}api/posts/post/${postId}`
      );
      const data = await res.data;
      setPost(data);
      setIsLoading(false);
    };
    getPost();
  }, [postId]);

  if (isLoading) {
    return (
      <section className="loading">
        <h3>Loading...</h3>
      </section>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleUpdate = async () => {
    await axios.patch(
      `${import.meta.env.VITE_SERVER_URL}api/posts/post/${postId}`,
      {
        title: post.title,
        body: post.body,
        category: post.category,
      }
    );
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
        <button onClick={handleUpdate}>Update</button>
      </section>
    </div>
  );
};

export default Update;
