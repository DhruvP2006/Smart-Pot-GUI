import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(
        "/login",
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );

      if (res.error) {
        toast.error(res.error);
      } else {
        setData({ email: "", password: "" });
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2>Login</h2>
        <form onSubmit={loginUser}>
          <input
            type="email"
            placeholder="Enter Email..."
            className={styles.input}
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Enter Password..."
            className={styles.input}
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
        <p className={styles.registerLink}>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
