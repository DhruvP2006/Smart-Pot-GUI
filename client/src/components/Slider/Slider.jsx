import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Slider.module.css";

const Slider = () => {
  const [moisture, setMoisture] = useState(50); // Default moisture level
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Optional: fetch current threshold from server on mount
    axios
      .get("http://localhost:8080/api/sensors/threshold")
      .then((res) => {
        if (res.data.moistureThreshold !== undefined) {
          setMoisture(res.data.moistureThreshold);
        }
      })
      .catch((err) => console.error("Failed to load initial threshold", err));
  }, []);

  const handleChange = async (e) => {
    const value = parseInt(e.target.value);
    setMoisture(value);

    try {
      await axios.post("http://localhost:8080/api/sensors/threshold", {
        moistureThreshold: value,
      });
      setStatus("✅ Threshold updated!");
    } catch (err) {
      console.error("❌ Error sending threshold:", err);
      setStatus("❌ Failed to update");
    }

    // Clear the status after 2 seconds
    setTimeout(() => setStatus(""), 2000);
  };

  return (
    <div className={styles.moistureContainer}>
      <h2>Moisture Control</h2>
      <input
        type="range"
        min="0"
        max="100"
        value={moisture}
        onChange={handleChange}
        className={styles.slider}
      />
      <p>
        Moisture Level: <span>{moisture}%</span>
      </p>
      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
};

export default Slider;
