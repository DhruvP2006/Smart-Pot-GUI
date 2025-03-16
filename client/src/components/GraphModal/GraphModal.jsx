import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import styles from "./GraphModal.module.css";

const sensorColors = {
  temperature: "#ff5733",
  humidity: "#3498db",
  moistureAnalog: "#2ecc71",
  flowRate: "#f1c40f",
  totalFlow: "#e67e22", // 🔹 Added totalFlow color
  luminance: "#9b59b6",
};

const sensorLabels = {
  temperature: "Temperature (°C)",
  humidity: "Humidity (%)",
  moistureAnalog: "Soil Moisture (%)",
  flowRate: "Flow Rate (L/min)",
  totalFlow: "Total Flow (L)", // 🔹 Added totalFlow label
  luminance: "Luminance (%)",
};

const GraphModal = ({ isOpen, onClose, type }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && type) {
      setIsLoading(true);
      axios
        .get("http://localhost:8080/api/graph-data")
        .then((response) => {
          const formattedData = Array.isArray(response.data)
            ? response.data.map((item) => ({
                name: new Date(item.timestamp).toLocaleTimeString(),
                value: item[type] !== undefined ? item[type] : null, // Handle missing values
              }))
            : [];
          setData(
            formattedData.filter((d) => d.value !== null && d.value >= 0)
          ); // Filter valid values
        })
        .catch((error) => {
          console.error("Error fetching graph data:", error);
          setData([]);
        })
        .finally(() => setIsLoading(false));
    } else {
      setData([]); // Reset data when modal closes
    }
  }, [isOpen, type]);

  if (!isOpen || !type) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close modal"
        >
          ✖
        </button>
        <h2>{sensorLabels[type] || "Sensor Data"}</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="95%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                fill={sensorColors[type] || "#7f8c8d"} // Default color if type is missing
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
};

export default GraphModal;
