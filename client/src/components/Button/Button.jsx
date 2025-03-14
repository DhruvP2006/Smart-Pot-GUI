import React from "react";
import styles from "./Button.module.css";

const Button = ({ icon, onClick }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        console.log("✅ Button clicked");
        if (onClick) {
          onClick();
        } else {
          console.error("❌ onClick function is undefined!");
        }
      }}
    >
      <img src={icon} alt="Graph" className={styles.icon} />
    </button>
  );
};

export default Button;
