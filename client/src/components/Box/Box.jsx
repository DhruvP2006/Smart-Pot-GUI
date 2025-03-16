import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Button from "../Button/Button";
import chartIcon from "./../../assets/chart.png";
import tempIcon from "./../../assets/temperature.png";
import humidityIcon from "./../../assets/humidity.png";
import moistureAnalogIcon from "./../../assets/chart.png";
import moistureDigitalIcon from "./../../assets/chart.png";
import flowRateIcon from "./../../assets/FlowMeter.png";
import totalFlowIcon from "./../../assets/FlowMeter.png"; // 🔹 New Icon
import luminanceIcon from "./../../assets/luminance.png";
import styles from "./Box.module.css";

const socket = io("http://localhost:8080"); // Adjust if needed

const sensorIcons = {
  temperature: tempIcon,
  humidity: humidityIcon,
  moistureAnalog: moistureAnalogIcon,
  moistureDigital: moistureDigitalIcon,
  flowRate: flowRateIcon,
  totalFlow: totalFlowIcon, // 🔹 Added totalFlow icon
  luminance: luminanceIcon,
};

const sensorLabels = {
  temperature: "Temperature (°C)",
  humidity: "Humidity (%)",
  moistureAnalog: "Soil Moisture (%)",
  moistureDigital: "Soil Moisture",
  flowRate: "Flow Rate (mL/min)",
  totalFlow: "Total Flow (mL)", // 🔹 Added totalFlow label
  luminance: "Luminance (%)",
};

const Box = ({ type, onOpenGraph }) => {
  const [value, setValue] = useState("-");

  useEffect(() => {
    // Listen for real-time sensor updates
    socket.on("sensorData", (data) => {
      if (data[type] !== undefined) {
        setValue(`${data[type]}`);
      }
    });

    return () => socket.off("sensorData");
  }, [type]);

  return (
    <div className={styles.box}>
      <div className={styles.boxIcon}>
        <img
          src={sensorIcons[type] || tempIcon} // Default icon
          alt={sensorLabels[type] || "Sensor"}
          className={styles.boxIconImg}
        />
      </div>
      <h2>{sensorLabels[type] || "Sensor Data"}</h2>
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
      <h1 className={styles.value}>{value}</h1>
    </div>
  );
};

export default Box;
