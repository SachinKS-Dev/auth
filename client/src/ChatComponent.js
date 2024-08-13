import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

function ChatComponent({ chatRoomId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [ws, setWs] = useState(null);
    const chatEndRef = useRef(null);

    const username = localStorage.getItem('username');

    useEffect(() => {
        if (chatRoomId) {
            const socket = new WebSocket(`ws://localhost:8001/ws/chat/${chatRoomId}/`);
            setWs(socket);

            socket.onmessage = (e) => {
                const data = JSON.parse(e.data);
                setMessages((prevMessages) => [...prevMessages, data]);
            };

            return () => {
                socket.close();
            };
        }
    }, [chatRoomId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (ws && newMessage.trim() !== '') {
            const messageData = {
                message: newMessage.trim(),
                username: username,
            };
            ws.send(JSON.stringify(messageData));
            setNewMessage('');
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, height: 300, overflowY: 'auto', mb: 2 }}>
                {messages.map((message, index) => (
                    <Typography key={index} sx={{ mb: 1 }}>
                        <strong>{message.sender}</strong>: {message.message}
                    </Typography>
                ))}
                <div ref={chatEndRef} />
            </Box>
            <Box sx={{ display: 'flex' }}>
                <TextField
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    sx={{ mr: 1 }}
                />
                <Button variant="contained" color="primary" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    Send
                </Button>
            </Box>
        </Box>
    );
}

export default ChatComponent;
