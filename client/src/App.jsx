import React, { useState } from "react";
import Box from "./components/Box/Box.jsx";
import GraphModal from "./components/GraphModal/GraphModal.jsx";
import Slider from "./components/Slider/Slider.jsx";
import "./App.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const openGraph = (type) => {
    console.log("📊 Graph Button Clicked - Type:", type);
    setSelectedType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="App">
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

export default App;
