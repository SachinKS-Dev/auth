import React, {useState, useEffect} from 'react';
import axios from './axiosInstance';

function ChatComponent({recipientId}) {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch chat history with the recipient
        const fetchChatHistory = async () => {
            try {
                const response = await axios.get(`/messages/?recipient=${recipientId}`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setChatHistory(response.data);
            } catch (err) {
                setError('Failed to load chat history.');
            }
        };

        fetchChatHistory();
    }, [recipientId, token]);

    const handleSendMessage = async () => {
        if (!message) {
            setError('Message cannot be empty');
            return;
        }

        try {
            const response = await axios.post(
                '/messages/send/',
                {recipient: recipientId, content: message},
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setChatHistory([...chatHistory, response.data]); // Append new message to chat history
            setMessage('');  // Clear the input after sending
            setError('');
            setSuccess('Message sent successfully!');
        } catch (err) {
            setError('Failed to send message');
            setSuccess('');
        }
    };

    return (
        <div>
            <div style={{height: '300px', overflowY: 'scroll', border: '1px solid #ddd', padding: '10px'}}>
                {chatHistory.map((chat) => (
                    <div key={chat.id} style={{marginBottom: '10px'}}>
                        <strong>{chat.sender.username}:</strong> {chat.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                style={{width: '80%', marginRight: '10px'}}
            />
            <button onClick={handleSendMessage} style={{width: '15%'}}>Send</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {success && <p style={{color: 'green'}}>{success}</p>}
        </div>
    );
}

export default ChatComponent;
