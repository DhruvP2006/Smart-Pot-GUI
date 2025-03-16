import React, { useState } from "react";
import Box from "./components/Box/Box.jsx";
import GraphModal from "./components/GraphModal/GraphModal.jsx";
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
      {/* Render all sensor boxes dynamically */}
      {[
        "temperature",
        "humidity",
        "moistureAnalog",
        "moistureDigital",
        "flowRate", // 🔹 Added flowRate
        "totalFlow", // 🔹 Added totalFlow
        "luminance",
      ].map((sensorType) => (
        <Box key={sensorType} type={sensorType} onOpenGraph={openGraph} />
      ))}

      {/* Graph Modal for selected sensor */}
      <GraphModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={selectedType}
      />
    </div>
  );
}

export default App;
