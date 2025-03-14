import React, { useState, useEffect } from "react"; // Remove useRef if not used
import { io } from "socket.io-client";
import Button from "../Button/Button";
import chartIcon from "./../../assets/chart.png";
// import tempIcon from "./../../assets/thermometer.png"; // Temp icon
// import humidityIcon from "./../../assets/drop.png"; // Humidity icon
import styles from "./Box.module.css";

const socket = io("http://localhost:8080"); // Adjust if needed

const Box = ({ type, onOpenGraph }) => {
  const [value, setValue] = useState("--");

  useEffect(() => {
    // Listen for real-time sensor updates
    socket.on("sensorData", (data) => {
      if (type === "temperature") setValue(`${data.temperature}°C`);
      else if (type === "humidity") setValue(`${data.humidity}%`);
    });

    return () => socket.off("sensorData");
  }, [type]);

  // Set icon & label based on type
  // const icon = type === "temperature" ? tempIcon : humidityIcon;
  const label = type === "temperature" ? "Temperature" : "Humidity";

  return (
    <div className={styles.box}>
      <div className={styles.boxIcon}>
        {/* <img src={icon} alt={label} className={styles.boxIconImg} /> */}
      </div>
      <h2>{label}</h2>
      <h1>{value}</h1>
      {/* Button click triggers the graph modal */}
      <Button
        icon={chartIcon}
        onClick={() => {
          console.log("✅ Button clicked in Box - Type:", type);

          if (onOpenGraph) {
            console.log("✅ onOpenGraph function exists, calling it...");
            onOpenGraph(type);
          } else {
            console.error("❌ onOpenGraph is UNDEFINED in Box component!");
          }
        }}
      />
    </div>
  );
};

export default Box;
