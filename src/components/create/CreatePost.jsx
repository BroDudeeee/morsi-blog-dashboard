import "./CreatePost.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import "../../firebase";

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
  const [disabled, setDisabled] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [postImg, setPostImg] = useState(null);

  const storage = getStorage();
  // Create the file metadata
  /** @type {any} */
  const metadata = {
    contentType: "image/jpeg",
  };

  const time = Date.now();
  const storageRef = ref(storage, "images/" + `${imgFile?.name}${time}`);
  const uploadTask = uploadBytesResumable(storageRef, imgFile, metadata);

  imgFile &&
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;

          case "storage/unknown":
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setPostImg(downloadURL);
          setImgFile(null);
        });
      }
    );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleCreate = async () => {
    setDisabled(true);
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}api/posts`,
      {
        title: post.title,
        body: postBody,
        category: post.category,
        image: postImg,
      }
    );

    const data = await res.data;
    console.log(data);
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
        <input type="file" onChange={(e) => setImgFile(e.target.files[0])} />
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
          disabled={!postBody || !post.title || disabled || !postImg}
        >
          Publish
        </button>
      </section>
    </div>
  );
};

export default CreatePost;
