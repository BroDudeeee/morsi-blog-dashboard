import "./CreatePost.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

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

const CreatePost = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", category: "" });
  const [postBody, setPostBody] = useState(null);
  const [postImg, setPostImg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("image", postImg);
    formData.append("title", post.title);
    formData.append("category", post.category);
    formData.append("body", postBody);

    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}api/posts`,
      formData
    );
    const data = await res.data;
    console.log(data);

    navigate("/");
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
            onChange={(e) => setPostImg(e.target.files[0])}
            // className="filePicker"
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
          onClick={handleCreate}
          className="createBtn"
          disabled={!postBody || !post.title || !postImg}
        >
          Publish
        </button>
      </section>
    </div>
  );
};

export default CreatePost;
