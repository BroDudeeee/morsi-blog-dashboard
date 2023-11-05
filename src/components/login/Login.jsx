import { useContext, useState } from "react";
import "./Login.css";
import axios from "axios";
import { UserContext } from "../../App";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [userData, setUserData] = useState({ name: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}api/auth/login`,
      {
        name: userData.name,
        password: userData.password,
      }
    );
    const data = await res.data;
    setUser(data.name);
    localStorage.setItem("user", JSON.stringify(data));
  };

  return (
    <div className="login">
      <form action="" onSubmit={handleSubmit} className="loginForm">
        <input
          type="text"
          placeholder="User..."
          name="name"
          value={userData.name}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Pass..."
          name="password"
          value={userData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
