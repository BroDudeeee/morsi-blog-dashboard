import Login from "./components/login/Login";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import { createContext, useState } from "react";
import Dashboard from "./components/dashboard/Dashboard";
import CreatePost from "./components/create/CreatePost";
import Post from "./components/post/Post";
import Update from "./components/update/Update";

export const UserContext = createContext();

const App = () => {
  const userData = JSON.parse(localStorage.getItem("user")) || [];

  const [user, setUser] = useState(userData.name || "");

  return (
    <main>
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path="/" element={!user ? <Login /> : <Dashboard />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route path="/post/:postId/update" element={<Update />} />
        </Routes>
      </UserContext.Provider>
    </main>
  );
};

export default App;
