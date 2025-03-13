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
import "./GraphModal.module.css"; // Ensure correct import

const GraphModal = ({ isOpen, onClose, type }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      axios
        .get("http://localhost:8080/api/graph-data")
        .then((response) => {
          const formattedData = response.data.map((item) => ({
            name: new Date(item.timestamp).toLocaleTimeString(),
            value: type === "temperature" ? item.temperature : item.humidity,
          }));
          setData(formattedData);
        })
        .catch((error) => {
          console.error("Error fetching graph data:", error);
          setData([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, type, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✖
        </button>
        <h2>{type === "temperature" ? "Temperature" : "Humidity"} Data</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
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
        )}
        {data.length === 0 && !isLoading && <p>No data available.</p>}
      </div>
    </div>
  );
};

export default GraphModal;
