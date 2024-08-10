import React, { useState, useEffect } from 'react';
import WebSocket from 'isomorphic-ws';

function ChatRoom({ roomName }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);

  useEffect(() => {
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((messages) => [...messages, data.message]);
    };
  }, []);

  const sendMessage = () => {
    ws.send(JSON.stringify({ message }));
    setMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatRoom;
