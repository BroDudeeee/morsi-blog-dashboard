import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";

const toolbar = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  ["link", "image", "formula"],

  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"],
];

const Update = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState({ title: "", category: "" });
  const [postBody, setPostBody] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const [postImg, setPostImg] = useState(null);

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}api/posts/post/${postId}`
      );
      const data = await res.data;

      setPost(data);
      setPostImg(data.image);
      setPostBody(data.body);
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
    setDisabled(true);

    const formData = new FormData();

    postImg && formData.append("image", postImg);
    formData.append("title", post.title);
    formData.append("category", post.category);
    formData.append("body", postBody);

    await axios.patch(
      `${import.meta.env.VITE_SERVER_URL}api/posts/post/${postId}`,
      formData
    );
    navigate("/");
    setDisabled(false);
  };

  return (
    <div className="createPage">
      <header className="createHeader">
        <Link to={"/"} className="createPostLink">
          <h4 className="name">HOME</h4>
        </Link>
      </header>
      <section className="create">
        <input
          type="text"
          id="title"
          name="title"
          value={post.title}
          placeholder="Title..."
          onChange={handleChange}
        />
        <section className="imageUploader">
          <input
            type="file"
            name="image"
            id="image"
            placeholder="Upload..."
            onChange={(e) => setPostImg(e.target.files[0])}
          />
        </section>
        <input
          type="text"
          id="cat"
          name="category"
          placeholder="Category..."
          value={post.category}
          onChange={handleChange}
        />
        <ReactQuill
          placeholder="Write your article..."
          value={postBody}
          onChange={(value) => setPostBody(value)}
          modules={{
            toolbar,
          }}
          theme="snow"
        />

        <button
          onClick={handleUpdate}
          className="createBtn"
          disabled={!postBody || !post.title || disabled}
        >
          Update
        </button>
      </section>
    </div>
  );
};

export default Update;
