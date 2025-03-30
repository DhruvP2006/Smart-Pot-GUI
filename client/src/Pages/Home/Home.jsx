import React, { useState } from "react";
import Box from "../../components/Box/Box";
import GraphModal from "../../components/GraphModal/GraphModal";
import Slider from "../../components/Slider/Slider";
import styles from "./Home.module.css";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const openGraph = (type) => {
    console.log("📊 Graph Button Clicked - Type:", type);
    setSelectedType(type);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.home}>
      {[
        "temperature",
        "humidity",
        "moistureAnalog",
        "moistureDigital",
        "flowRate",
        "totalFlow",
        "luminance",
      ].map((sensorType) => (
        <Box key={sensorType} type={sensorType} onOpenGraph={openGraph} />
      ))}

      <GraphModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={selectedType}
      />
      <Slider />
    </div>
  );
}

export default Home;
