// GraphModal.jsx (Fixed)
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

const GraphModal = ({ isOpen, onClose, type }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      axios
        .get("http://localhost:8080/api/graph-data")
        .then((response) => {
          const formattedData = Array.isArray(response.data)
            ? response.data.map((item) => ({
                name: new Date(item.timestamp).toLocaleTimeString(),
                value:
                  type === "temperature" ? item.temperature : item.humidity,
              }))
            : [];
          setData(formattedData);
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

  if (!isOpen) return null;

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
        <h2>{type === "temperature" ? "Temperature" : "Humidity"} Data</h2>
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
                fill={type === "temperature" ? "#ff5733" : "#3498db"}
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
