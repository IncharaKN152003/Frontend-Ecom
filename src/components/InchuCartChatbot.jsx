import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080";

// ── Fallback reply if backend is down ──
const getFallbackReply = (msg) => {
  const text = msg.toLowerCase().trim();
  if (/^(hi|hello|hey|namaste|hii)/.test(text))
    return "Namaste! 👋 Welcome to InchuCart!\n\nI'm your AI shopping assistant. Ask me anything about products, orders, shipping, returns and more!\n\nHow can I help you today? 😊";
  if (/bye|goodbye|see you/.test(text))
    return "Thank you for visiting InchuCart! 🙏 Happy shopping. See you soon! 👋";
  return "🤔 I'm having trouble connecting right now. Please try again in a moment!\n\nOr contact us at support@inchucart.com 📧";
};

const suggestedQuestions = [
  "What watches do you have?",
  "Men's collection prices?",
  "Return policy?",
  "Is COD available?",
  "Track my order",
  "Size guide",
  "Current offers?",
  "Shipping details",
];

export default function InchuCartChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Namaste! 👋 Welcome to InchuCart!\n\nI'm your AI-powered shopping assistant. Ask me about products, orders, shipping, returns, and more!\n\nHow can I help you today? 😊",
    },
  ]);

  // ── Chat history for OpenAI (role/content format) ──
  const [chatHistory, setChatHistory] = useState([]);

  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized)
      setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen, isMinimized]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    setInput("");
    setShowSuggestions(false);

    // Add user message to UI
    setMessages(prev => [...prev, { from: "user", text: userText }]);
    setIsTyping(true);

    // Build updated history with new user message
    const updatedHistory = [...chatHistory, { role: "user", content: userText }];
    setChatHistory(updatedHistory);

    try {
      // Call backend OpenAI route
      const response = await axios.post(`${API_URL}/api/chat`, {
        messages: updatedHistory,
      });

      const botReply = response.data.success
        ? response.data.reply
        : getFallbackReply(userText);

      // Add assistant reply to history
      setChatHistory(prev => [...prev, { role: "assistant", content: botReply }]);

      setMessages(prev => [...prev, { from: "bot", text: botReply }]);

    } catch (error) {
      console.error("❌ Chat error:", error.message);
      const fallback = getFallbackReply(userText);
      setMessages(prev => [...prev, { from: "bot", text: fallback }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatText = (text) =>
    text.split("\n").map((line, i, arr) => (
      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
    ));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .ic-bubble {
          position: fixed; bottom: 28px; right: 28px; z-index: 9999;
          width: 60px; height: 60px; border-radius: 50%;
          background: linear-gradient(135deg, #C4A962, #8B7535);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 24px rgba(196,169,98,0.5);
          transition: transform 0.3s ease;
          animation: ic-pulse 3s infinite;
        }
        .ic-bubble:hover { transform: scale(1.1); }
        @keyframes ic-pulse {
          0%,100% { box-shadow: 0 6px 24px rgba(196,169,98,0.5), 0 0 0 0 rgba(196,169,98,0.3); }
          50% { box-shadow: 0 6px 24px rgba(196,169,98,0.5), 0 0 0 10px rgba(196,169,98,0); }
        }
        .ic-badge {
          position: absolute; top: -2px; right: -2px;
          width: 18px; height: 18px; background: #E74C3C;
          border-radius: 50%; border: 2px solid white;
          font-size: 10px; font-weight: 700; color: white;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
        }
        .ic-window {
          position: fixed; bottom: 100px; right: 28px; z-index: 9998;
          width: 370px; background: white; border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          display: flex; flex-direction: column; overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          animation: ic-slideIn 0.35s cubic-bezier(0.34,1.2,0.64,1);
        }
        .ic-window.minimized { height: 64px !important; overflow: hidden; }
        @keyframes ic-slideIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .ic-header {
          background: linear-gradient(135deg, #1A1A1A, #2C2C2C);
          padding: 16px 18px; display: flex; align-items: center;
          gap: 12px; cursor: pointer; flex-shrink: 0;
        }
        .ic-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, #C4A962, #8B7535);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .ic-header-info { flex: 1; }
        .ic-header-name { font-size: 15px; font-weight: 600; color: white; line-height: 1.2; }
        .ic-header-status { font-size: 12px; color: #C4A962; display: flex; align-items: center; gap: 5px; margin-top: 2px; }
        .ic-dot { width: 7px; height: 7px; border-radius: 50%; background: #2ECC71; animation: ic-blink 2s infinite; }
        @keyframes ic-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .ic-header-btns { display: flex; gap: 6px; }
        .ic-hbtn {
          background: rgba(255,255,255,0.1); border: none; border-radius: 7px;
          width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(255,255,255,0.7); transition: background 0.2s;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
        }
        .ic-hbtn:hover { background: rgba(255,255,255,0.2); color: white; }
        .ic-messages {
          flex: 1; overflow-y: auto; padding: 16px 14px;
          display: flex; flex-direction: column; gap: 12px;
          height: 360px; background: #F8F6F2;
        }
        .ic-messages::-webkit-scrollbar { width: 4px; }
        .ic-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
        .ic-msg-row { display: flex; gap: 8px; align-items: flex-end; }
        .ic-msg-row.user { flex-direction: row-reverse; }
        .ic-msg-icon {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #C4A962, #8B7535);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; flex-shrink: 0;
        }
        .ic-msg {
          max-width: 80%; padding: 11px 14px; border-radius: 16px;
          font-size: 13.5px; line-height: 1.55;
          animation: ic-msgIn 0.25s ease;
        }
        @keyframes ic-msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ic-msg.bot {
          background: white; color: #1A1A1A; border-bottom-left-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07); border: 1px solid rgba(196,169,98,0.2);
        }
        .ic-msg.user {
          background: linear-gradient(135deg, #1A1A1A, #3A3A3A);
          color: white; border-bottom-right-radius: 4px;
        }
        .ic-typing {
          display: flex; gap: 5px; align-items: center;
          padding: 12px 16px; background: white; border-radius: 16px;
          border-bottom-left-radius: 4px; width: fit-content;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07); border: 1px solid rgba(196,169,98,0.2);
        }
        .ic-tdot { width: 7px; height: 7px; border-radius: 50%; background: #C4A962; animation: ic-bounce 1.2s infinite; }
        .ic-tdot:nth-child(2) { animation-delay: 0.2s; }
        .ic-tdot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ic-bounce {
          0%,60%,100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        .ic-suggestions { padding: 0 14px 10px; background: #F8F6F2; display: flex; flex-wrap: wrap; gap: 6px; }
        .ic-chip {
          background: white; border: 1px solid rgba(196,169,98,0.4);
          color: #3A3A3A; padding: 6px 12px; border-radius: 20px;
          font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-weight: 500; transition: all 0.2s; white-space: nowrap;
        }
        .ic-chip:hover { background: #F5EDD6; border-color: #C4A962; color: #1A1A1A; }
        .ic-input-area {
          padding: 12px 14px; background: white;
          border-top: 1px solid rgba(196,169,98,0.2);
          display: flex; gap: 8px; align-items: center; flex-shrink: 0;
        }
        .ic-input {
          flex: 1; border: 1.5px solid #E8E0CC; border-radius: 12px;
          padding: 10px 13px; font-size: 13.5px; font-family: 'DM Sans', sans-serif;
          outline: none; background: #F8F6F2; color: #1A1A1A; transition: border-color 0.2s;
        }
        .ic-input:focus { border-color: #C4A962; background: white; }
        .ic-input::placeholder { color: #AAA; }
        .ic-send {
          width: 40px; height: 40px; border-radius: 11px;
          background: linear-gradient(135deg, #C4A962, #8B7535);
          border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: transform 0.2s; box-shadow: 0 3px 10px rgba(196,169,98,0.35);
        }
        .ic-send:hover:not(:disabled) { transform: scale(1.07); }
        .ic-send:disabled { opacity: 0.45; cursor: not-allowed; }
        .ic-footer {
          padding: 7px; background: white; border-top: 1px solid #F0EBE0;
          text-align: center; font-size: 11px; color: #CCC; font-family: 'DM Sans', sans-serif;
        }
        .ic-ai-badge {
          display: inline-flex; align-items: center; gap: 4px;
          background: linear-gradient(135deg, #C4A962, #8B7535);
          color: white; font-size: 10px; font-weight: 600;
          padding: 2px 8px; border-radius: 10px; margin-left: 6px;
          font-family: 'DM Sans', sans-serif;
        }
        @media (max-width: 480px) {
          .ic-window { width: calc(100vw - 20px); right: 10px; bottom: 85px; }
          .ic-bubble { right: 14px; bottom: 14px; }
        }
      `}</style>

      {/* Floating Bubble */}
      <button className="ic-bubble" onClick={() => { setIsOpen(o => !o); setIsMinimized(false); }} aria-label="Open chat">
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <div className="ic-badge">1</div>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`ic-window ${isMinimized ? "minimized" : ""}`}>
          {/* Header */}
          <div className="ic-header" onClick={() => setIsMinimized(m => !m)}>
            <div className="ic-avatar">🛍️</div>
            <div className="ic-header-info">
              <div className="ic-header-name">
                InchuCart Support
                <span className="ic-ai-badge">✨ AI</span>
              </div>
              <div className="ic-header-status"><div className="ic-dot"/> Online · Powered by GPT</div>
            </div>
            <div className="ic-header-btns" onClick={e => e.stopPropagation()}>
              <button className="ic-hbtn" onClick={() => setIsMinimized(m => !m)}>—</button>
              <button className="ic-hbtn" onClick={() => setIsOpen(false)}>✕</button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="ic-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`ic-msg-row ${msg.from}`}>
                    {msg.from === "bot" && <div className="ic-msg-icon">🛍️</div>}
                    <div className={`ic-msg ${msg.from}`}>{formatText(msg.text)}</div>
                  </div>
                ))}
                {isTyping && (
                  <div className="ic-msg-row bot">
                    <div className="ic-msg-icon">🛍️</div>
                    <div className="ic-typing">
                      <div className="ic-tdot"/><div className="ic-tdot"/><div className="ic-tdot"/>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef}/>
              </div>

              {showSuggestions && (
                <div className="ic-suggestions">
                  {suggestedQuestions.map((q, i) => (
                    <button key={i} className="ic-chip" onClick={() => sendMessage(q)}>{q}</button>
                  ))}
                </div>
              )}

              <div className="ic-input-area">
                <input
                  ref={inputRef}
                  className="ic-input"
                  placeholder="Ask me anything about InchuCart..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                />
                <button className="ic-send" onClick={() => sendMessage()} disabled={!input.trim() || isTyping}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>

              <div className="ic-footer">InchuCart © 2026 · AI-Powered by OpenAI ✨</div>
            </>
          )}
        </div>
      )}
    </>
  );
}
