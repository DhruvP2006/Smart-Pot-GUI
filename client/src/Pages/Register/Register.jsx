import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css"; // CSS module import

function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    plantName: "",
    email: "",
    password: "",
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { name, plantName, email, password } = data;
    try {
      const response = await axios.post("/register", {
        name,
        plantName,
        email,
        password,
      });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setData({ name: "", plantName: "", email: "", password: "" });
        toast.success("Registration successful. Welcome!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2>Register</h2>
        <form onSubmit={registerUser}>
          <input
            type="text"
            placeholder="Enter Name"
            className={styles.input}
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Enter Plant`s Name"
            className={styles.input}
            value={data.plantName}
            onChange={(e) => setData({ ...data, plantName: e.target.value })}
          />
          <input
            type="email"
            placeholder="Enter Email"
            className={styles.input}
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Enter Password"
            className={styles.input}
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <button className={styles.button} type="submit">
            Register
          </button>
        </form>
        <p className={styles.registerLink}>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
