import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

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
        <Box sx={{ p: 2, mt:4 }}>
            <Box
                sx={{
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    p: 2,
                    height: 300,
                    overflowY: 'scroll',
                    overflowX: 'hidden',  // Ensure horizontal scrolling is disabled
                    mb: 2,
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    flexDirection: 'column',
                    scrollbarWidth: 'none', /* For Firefox */
                    '&::-webkit-scrollbar': {
                        display: 'none', /* For Chrome, Safari, and Opera */
                    },
                }}
            >
                {messages.map((message, index) => (
                    <Paper
                        key={index}
                        sx={{
                            p: 1.5,
                            mb: 1,
                            maxWidth: '70%',  // Ensure messages don't exceed 70% of the container's width
                            alignSelf: message.sender === username ? 'flex-end' : 'flex-start',
                            backgroundColor: message.sender === username ? '#DCF8C6' : '#FFFFFF',
                            borderRadius: 2,
                            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                            wordBreak: 'break-word',  // Break long words to avoid overflow
                        }}
                    >
                        <Typography variant="body2" sx={{ color: '#555' }}>
                            {message.sender === username ? 'You' : message.sender}
                        </Typography>
                        <Typography variant="body1">{message.message}</Typography>
                    </Paper>
                ))}
                <div ref={chatEndRef} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
