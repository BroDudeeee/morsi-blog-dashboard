import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
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

const Update = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}api/posts/post/${postId}`
      );
      const data = await res.data;

      setPost(data);
      setImgFile(data.image);
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

  const updateImage = () => {
    const desertRef = ref(storage, `${post.image}`);

    deleteObject(desertRef)
      .then(() => {
        console.log(desertRef);
      })
      .catch((error) => {
        console.log(error);
      });

    const time = Date.now();
    const storageRef = ref(storage, "images/" + `${postImg.name}${time}`);
    const uploadTask = uploadBytesResumable(storageRef, postImg, metadata);

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
          setImgFile(downloadURL);
        });
      }
    );
  };

  const handleUpdate = async () => {
    setDisabled(true);
    await axios.patch(
      `${import.meta.env.VITE_SERVER_URL}api/posts/post/${postId}`,
      {
        title: post.title,
        body: postBody,
        category: post.category,
        image: imgFile,
      }
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
          <button disabled={!postImg} onClick={updateImage}>
            Update Image
          </button>
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
