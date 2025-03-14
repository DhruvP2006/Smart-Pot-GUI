// TestChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TestChart = () => {
  const staticData = [
    { name: "A", value: 10 },
    { name: "B", value: 20 },
    { name: "C", value: 15 },
  ];

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h2>Test Chart</h2>
      <ResponsiveContainer width="95%" height={300}>
        <BarChart data={staticData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#ff5733" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TestChart;
