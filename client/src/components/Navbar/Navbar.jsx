import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>SmartPot 🌿</div>
      <button
        className={styles.toggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      <div className={`${styles.links} ${isOpen ? styles.show : ""}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>
          Home
        </Link>
        {/* <Link to="/Register" onClick={() => setIsOpen(false)}>
          Register
        </Link>
        <Link to="/Login" onClick={() => setIsOpen(false)}>
          Login
        </Link> */}
        <Link to="/chat" onClick={() => setIsOpen(false)}>
          Talk with Your Plant
        </Link>
        <Link to="/login" onClick={() => setIsOpen(false)}>
          Logout
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
