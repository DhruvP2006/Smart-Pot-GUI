import React from "react";
import styles from "./Button.module.css";

const Button = ({ icon, onClick }) => {
  return (
    <button
      className={styles.button}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) {
          onClick();
        }
      }}
    >
      <img src={icon} alt="Graph" className={styles.icon} />
    </button>
  );
};

export default Button;
