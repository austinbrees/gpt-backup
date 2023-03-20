import React from 'react';
import './App.css';
import './normal.css';
import { useState } from 'react';

function App() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "Hello, I am GPT-3.5 Turbo. How can I help you today?",
    },
  ]);

  async function handleSubmit(e) {
    e.preventDefault();
    setChatLog((prevChatLog) => [...prevChatLog, { user: "me", message: `${input}` }]);
    setInput("");
    const response = await fetch("http://localhost:3080", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
      }),
    });
    const data = await response.json();
    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { user: "gpt", message: `${data.message}` },
    ]);
  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button">
          <span>+</span>
          New Chat
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chat-input-textarea"
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;

const ChatMessage = ({ message }) => {
  const parseMessage = (msg) => {
    const parts = msg.split(/(```[\s\S]*?```|`[\s\S]*?`)/);
    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        return (
          <pre key={index} className="code-block">
            {part.slice(3, -3)}
          </pre>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={index} className="inline-code">
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`chat-message ${message.user === "gpt" ? "chatgpt" : ""}`}>
      <div className="chat-message-center">
        <div className={`avatar ${message.user === "gpt" ? "chatgpt" : ""}`}></div>
        <div className="message">{parseMessage(message.message)}</div>
      </div>
    </div>
  );
};
