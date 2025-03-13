import "./App.css";
import { useState } from "react";
import Box from "./components/Box/Box.jsx";
import GraphModal from "./components/GraphModal/GraphModal.jsx";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  // Open the modal with selected graph type
  const openGraph = (type) => {
    console.log("Graph Button Clicked - Type:", type); // Debugging log
    setSelectedType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="App">
      {/* Separate Box for Temperature */}
      <Box
        type="temperature"
        onOpenGraph={(type) => {
          console.log("✅ onOpenGraph triggered with:", type);
          openGraph(type);
        }}
      />

      <Box
        type="humidity"
        onOpenGraph={(type) => {
          console.log("✅ onOpenGraph triggered with:", type);
          openGraph(type);
        }}
      />

      {/* Render Graph Modal Only When Needed */}
      {isModalOpen && (
        <GraphModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={selectedType} // Pass the selected type (Temp or Humidity)
        />
      )}
    </div>
  );
}

export default App;
