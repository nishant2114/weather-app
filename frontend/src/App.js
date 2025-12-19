import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const bottomRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setChat((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();

      // Bot message
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: data.response },
      ]);

      // ✅ SAFE parsing (supports 30.99, 28, etc.)
      const tempMatch = data.response.match(/(-?\d+(\.\d+)?)/);
      const conditionMatch = data.response.match(
        /clear|cloud|rain|storm|snow|smoke|haze/i
      );

      if (tempMatch) {
        setWeather({
          temperature: tempMatch[1],
          condition: conditionMatch ? conditionMatch[0] : "N/A",
          time: new Date().toLocaleTimeString(),
          query: userMessage,
        });
      }
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ AI service is temporarily unavailable. Please try again later.",
        },
      ]);
    }

    setLoading(false);
  };

  const clearChat = () => {
    setChat([]);
    setWeather(null);
  };

  return (
    <div className={`container ${dark ? "dark" : ""}`}>
      <header>🌦️ Weather Assistant</header>

      <p className="subtitle">
        Real-time weather insights powered by API integration
      </p>

      <button className="mode-btn" onClick={() => setDark(!dark)}>
        {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="chat-box">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`chat ${msg.sender} ${
              msg.sender === "bot" &&
              msg.text.match(/\d+(\.\d+)?\s*°?\s*c/i)
                ? "weather-line"
                : ""
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && <div className="loader"></div>}
        <div ref={bottomRef}></div>
      </div>

      {/* ✅ SUMMARY (same temperature as chat) */}
      {weather && (
        <div className="summary">
          <div>
            <span>🌡 Temperature</span>
            <strong className="temp-green">
              {weather.temperature} °C
            </strong>
          </div>

          <div>
            <span>🌤 Condition</span>
            <strong>{weather.condition}</strong>
          </div>

          <div>
            <span>🕒 Updated</span>
            <strong>{weather.time}</strong>
          </div>

          <div>
            <span>📍 Query</span>
            <strong>{weather.query}</strong>
          </div>
        </div>
      )}

      <div className="input-area">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter city name (e.g. Pune weather)"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <button className="clear-btn" onClick={clearChat}>
        Clear Chat
      </button>
    </div>
  );
}

export default App;
