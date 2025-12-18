import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const getWeatherEmoji = (text) => {
    const t = text.toLowerCase();
    if (t.includes("clear")) return "☀️";
    if (t.includes("cloud")) return "☁️";
    if (t.includes("rain")) return "🌧️";
    if (t.includes("snow")) return "❄️";
    if (t.includes("storm")) return "⛈️";
    return "🌤️";
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = {
      sender: "user",
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      const botMsg = {
        sender: "bot",
        text: `${getWeatherEmoji(data.response)} ${data.response}`,
        time: new Date().toLocaleTimeString(),
      };

      setChat((prev) => [...prev, botMsg]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Error connecting to backend",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }

    setLoading(false);
  };

  const clearChat = () => {
    setChat([]);
  };

  return (
    <div className="app">
      <h1>🌦️ Weather Chat App</h1>

      <div className="chat-box">
        {chat.map((msg, i) => (
          <div key={i} className={`msg ${msg.sender}`}>
            <span>{msg.text}</span>
            <div className="time">{msg.time}</div>
          </div>
        ))}
        {loading && <div className="msg bot">⏳ Fetching Weather Data</div>}
        <div ref={bottomRef}></div>
      </div>

      <div className="input-area">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask weather... e.g. Pune weather"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
        <button className="clear" onClick={clearChat}>Clear</button>
      </div>
    </div>
  );
}

export default App;