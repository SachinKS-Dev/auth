// import React, { useState, useEffect } from 'react';
// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';
// import axios from './axiosInstance';
//
// const ChatComponent = ({ recipientId }) => {
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');
//     const [client, setClient] = useState(null);
//     const token = localStorage.getItem('token');
//
//     useEffect(() => {
//         const socket = new SockJS(`http://127.0.0.1:8000/ws/chat/${recipientId}/`);
//         const stompClient = new Client({
//             webSocketFactory: () => socket,
//             connectHeaders: {
//                 Authorization: `Token ${token}`
//             },
//             debug: (str) => {
//                 console.log('STOMP: ' + str);
//             },
//             onConnect: () => {
//                 console.log('Connected to WebSocket');
//
//                 stompClient.subscribe(`/ws/chat/${recipientId}/`, (message) => {
//                     setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
//                 });
//             },
//             onStompError: (frame) => {
//                 console.error('STOMP Error: ' + frame.headers['message']);
//                 setError('Failed to connect to chat server.');
//             },
//             reconnectDelay: 5000,
//         });
//
//         stompClient.activate();
//         setClient(stompClient);
//
//         return () => {
//             if (client) {
//                 client.deactivate();
//                 console.log('Disconnected from WebSocket');
//             }
//         };
//     }, [recipientId, token]);
//
//     const handleSendMessage = async () => {
//         try {
//             await axios.post(
//                 '/messages/send/',
//                 { content: message, recipient: recipientId },
//                 {
//                     headers: {
//                         Authorization: `Token ${token}`,
//                     },
//                 }
//             );
//             setMessage('');
//         } catch (err) {
//             setError('Failed to send message.');
//         }
//     };
//
//     return (
//         <div>
//             <h3>Chat with User {recipientId}</h3>
//             <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ddd', marginBottom: '10px' }}>
//                 {messages.map((msg, index) => (
//                     <div key={index}>
//                         <strong>{msg.sender}</strong>: {msg.content}
//                     </div>
//                 ))}
//             </div>
//             <textarea
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type your message here..."
//                 rows="3"
//                 style={{ width: '100%' }}
//             />
//             <button onClick={handleSendMessage}>Send</button>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//         </div>
//     );
// };
//
// export default ChatComponent;


import React, {useState, useEffect} from 'react';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from './axiosInstance';

const ChatComponent = ({recipientId}) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [client, setClient] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const socket = new SockJS(`http://127.0.0.1:8000/ws/chat/${recipientId}/`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Token ${token}`
            },
            debug: (str) => {
                console.log('STOMP: ' + str);
            },
            onConnect: () => {
                console.log('Connected to WebSocket');

                stompClient.subscribe(`/ws/chat/${recipientId}/`, (message) => {
                    setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
                });
            },
            onStompError: (frame) => {
                console.error('STOMP Error: ' + frame.headers['message']);
                setError('Failed to connect to chat server.');
            },
            reconnectDelay: 5000,
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            if (client) {
                client.deactivate();
                console.log('Disconnected from WebSocket');
            }
        };
    }, [recipientId, token]);

    const handleSendMessage = async () => {
        try {
            await axios.post(
                '/messages/send/',
                {content: message, recipient: recipientId},
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setMessage('');
        } catch (err) {
            setError('Failed to send message.');
        }
    };

    return (
        <div>
            <h3>Chat with User {recipientId}</h3>
            <div style={{height: '300px', overflowY: 'scroll', border: '1px solid #ddd', marginBottom: '10px'}}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}</strong>: {msg.content}
                    </div>
                ))}
            </div>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows="3"
                style={{width: '100%'}}
            />
            <button onClick={handleSendMessage}>Send</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default ChatComponent;
