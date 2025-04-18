import React, { useState } from "react";
import styles from "./ChatBot.module.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "🌱 Hello! I'm your Smart Pot assistant. Ask me anything about your plant!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // 🔹 Step 1: Fetch the latest ESP32 sensor data
      const sensorRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/data`,
        {
          credentials: "include",
        }
      );
      const sensorData = await sensorRes.json();

      // 🔹 Step 2: Combine user's input with sensor context
      const combinedMessage = `
You are a Smart Pot assistant. Here's the latest sensor data:
- Temperature: ${sensorData.temperature}°C
- Humidity: ${sensorData.humidity}%
- Moisture: ${sensorData.moisture}%
Using this data, answer the following question: "${input}"
    `;

      // 🔹 Step 3: Send to Gemini
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: combinedMessage }),
      });

      const data = await res.json();
      const botReply = data.response || "⚠️ No response from Gemini.";

      const botMsg = { sender: "bot", text: botReply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot error:", err);
      const errorMsg = {
        sender: "bot",
        text: "⚠️ Error fetching response.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className={styles.fullscreenChat}>
      <div className={styles.chatHeader}>Smart Pot Assistant 🌱</div>

      <div className={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.chatMessage} ${
              msg.sender === "user" ? styles.user : styles.bot
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className={`${styles.chatMessage} ${styles.bot}`}>
            ⏳ Thinking...
          </div>
        )}
      </div>

      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder="Ask something like 'What’s the soil moisture?'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
