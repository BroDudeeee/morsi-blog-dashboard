import { getStorage, ref, deleteObject } from "firebase/storage";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Post.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Post = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [postData, setPostData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}api/posts/post/${postId}`
      );
      const data = await res.data;
      setPostData(data);
      setIsLoading(false);
    };
    getPost();
  }, [postId]);

  const deletePost = async () => {
    const res = await axios.delete(
      `${import.meta.env.VITE_SERVER_URL}api/posts/post/${postId}`
    );
    const data = await res.data;

    const storage = getStorage();

    const desertRef = ref(storage, data.image);

    deleteObject(desertRef)
      .then(() => {
        console.log(desertRef);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(data);
    navigate("/");
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
      <section className="postPage">
        <img src={postData.image} alt={postData.title} className="postImg" />
        <article className="postPage">
          <h4>{postData?.title}</h4>
          <div
            className="body"
            dangerouslySetInnerHTML={{ __html: postData.body }}
          />
        </article>
      </section>
    </>
  );
};

export default Post;
