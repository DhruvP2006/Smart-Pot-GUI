import { useState } from "react";
import styles from "./Slider.module.css";
const Slider = () => {
  const [moisture, setMoisture] = useState(50); // Default moisture level at 50%

  return (
    <div className={styles.moistureContainer}>
      <h2>Moisture Control</h2>
      <input
        type="range"
        min="0"
        max="100"
        value={moisture}
        onChange={(e) => setMoisture(e.target.value)}
        className={styles.slider}
      />
      <p>
        Moisture Level: <span>{moisture}%</span>
      </p>
    </div>
  );
};

export default Slider;
