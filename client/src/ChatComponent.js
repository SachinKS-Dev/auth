import React, { useState, useEffect, useRef } from 'react';

function ChatComponent({ chatRoomId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [ws, setWs] = useState(null);
    const chatEndRef = useRef(null);

    // Retrieve username from local storage
    const username = localStorage.getItem('username');

    useEffect(() => {
        // Establish WebSocket connection
        const socket = new WebSocket(`ws://localhost:8001/ws/chat/${chatRoomId}/`);

        setWs(socket);

        // Handle incoming WebSocket messages
        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        // Scroll to the end of the chat when a new message arrives
        return () => {
            socket.close();
        };
    }, [chatRoomId]);

    useEffect(() => {
        // Auto-scroll to the latest message when messages are updated
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        alert(username)
        if (ws && newMessage.trim() !== '') {
            const messageData = {
                message: newMessage.trim(),
                sender: username, // Include username in the message data
            };
            ws.send(JSON.stringify(messageData));
            setNewMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div>
            <div
                style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '10px',
                    height: '300px',
                    overflowY: 'scroll',
                    marginBottom: '10px',
                }}
            >
                {messages.map((message, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <strong>{message.sender}</strong>: {message.message}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div style={{ display: 'flex' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    style={{
                        flexGrow: 1,
                        marginRight: '10px',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                    }}
                />
                <button
                    onClick={handleSendMessage}
                    style={{ padding: '8px 16px' }}
                    disabled={!newMessage.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatComponent;
