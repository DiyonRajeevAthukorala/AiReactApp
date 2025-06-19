import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Type for each chat message
type Message = {
  sender: "user" | "bot";
  text: string;
};

function App() {
  const [chat, setChat] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setChat((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage: Message = { sender: "bot", text: data.reply };
      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setChat((prev) => [...prev, { sender: "bot", text: "⚠️ Something went wrong!" }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  return (
    <div className="App">
      <h1>AI Communicator</h1>

      <div className="chat-box">
        {chat.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot">Typing...</div>}
        <div ref={bottomRef}></div>
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Start Chatting..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
