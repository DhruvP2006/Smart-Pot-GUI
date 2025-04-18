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

  const streamBotReply = async (fullText) => {
    const words = fullText.split(" ");
    let currentText = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      // Capture the current text for this iteration
      const newText = currentText + word + " ";

      // Use a closure-safe timeout
      await new Promise((resolve) => {
        setTimeout(() => {
          setMessages((prev) => {
            const updated = [...prev];
            // If last bot message is streaming, update it; otherwise, add new
            if (
              updated.length &&
              updated[updated.length - 1].sender === "bot" &&
              updated[updated.length - 1].text.endsWith("…")
            ) {
              updated[updated.length - 1].text = newText + "…";
            } else {
              updated.push({ sender: "bot", text: newText + "…" });
            }
            return updated;
          });
          resolve();
        }, 25);
      });

      currentText = newText; // update after delay
    }

    // Replace last "…"-ending message with the complete one (no dots)
    setMessages((prev) => {
      const updated = [...prev];
      if (
        updated.length &&
        updated[updated.length - 1].sender === "bot" &&
        updated[updated.length - 1].text.endsWith("…")
      ) {
        updated[updated.length - 1].text = currentText.trim();
      }
      return updated;
    });
  };

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
      const sensorData = (await sensorRes.json())[0];
      console.log(sensorData);

      // 🔹 Step 2: Combine user's input with sensor context
      const combinedMessage = `Using the above data, answer the following question: "${input}"`;

      // 🔹 Step 3: Send to Gemini
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: combinedMessage }),
      });

      const data = await res.json();
      const botReply = data.response || "⚠️ No response from Gemini.";

      // const botMsg = { sender: "bot", text: botReply };

      // setMessages((prev) => [...prev, botMsg]);
      await streamBotReply(botReply);
      setLoading(false);
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
