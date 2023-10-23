import { useContext, useEffect, useState } from "react";
import "./Dashboard.css";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [pageNum, setPageNum] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const getPosts = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/posts/page/${pageNum}`
      );
      const data = await res.data;
      setPosts([...posts, ...data]);
      setIsLoading(false);
    };
    getPosts();
  }, [pageNum]);

  if (isLoading) {
    return (
      <div className="loading">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <Link to={"/"} className="createPostLink">
          <h4 className="name">{user}</h4>
        </Link>
        <Link to={"/create"} className="createPostLink">
          Create Post
        </Link>
      </header>
      <section className="posts">
        {posts.map((post) => (
          <Link
            key={post._id}
            className="singlePostLink"
            to={`/post/${post._id}`}
          >
            <section key={post._id} className="singlePost">
              <h4>{post.title}</h4>
              <span>{post._id}</span>
            </section>
          </Link>
        ))}
      </section>
      <div className="loadMore">
        <button className="loadMoreBtn" onClick={() => setPageNum(pageNum + 1)}>
          Load More...
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
