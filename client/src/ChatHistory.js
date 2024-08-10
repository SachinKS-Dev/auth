import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChatHistory({ recipientId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get(`/chat-history/${recipientId}/`)
      .then(response => setMessages(response.data))
      .catch(error => console.error(error));
  }, [recipientId]);

  return (
    <div>
      {messages.map((msg, index) => (
        <p key={index}>{msg.sender}: {msg.content}</p>
      ))}
    </div>
  );
}

export default ChatHistory;
