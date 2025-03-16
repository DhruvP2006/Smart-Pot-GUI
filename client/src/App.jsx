// App.jsx
import React, { useState } from "react";
import Box from "./components/Box/Box.jsx";
import GraphModal from "./components/GraphModal/GraphModal.jsx";
import "./App.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const openGraph = (type) => {
    console.log("Graph Button Clicked - Type:", type);
    setSelectedType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="App">
      <Box type="temperature" onOpenGraph={openGraph} />
      <Box type="humidity" onOpenGraph={openGraph} />
      <Box type="moisture" onOpenGraph={openGraph} />
      <Box type="Flow" onOpenGraph={openGraph} />
      <GraphModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={selectedType}
      />
    </div>
  );
}

export default App;
