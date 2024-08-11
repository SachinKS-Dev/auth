import React, { useState, useEffect, useRef } from 'react';
import axios from './axiosInstance';

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [chatUserId, setChatUserId] = useState(null);
    const [error, setError] = useState(''); // Define error state
    const ws = useRef(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('users/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users.'); // Handle error
            }
        };

        const fetchReceivedRequests = async () => {
            try {
                const response = await axios.get('interests/received/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setReceivedRequests(response.data);
            } catch (err) {
                setError('Failed to fetch received requests.'); // Handle error
            }
        };

        fetchUsers();
        fetchReceivedRequests();
    }, [token]);

    useEffect(() => {
        if (chatUserId) {
            ws.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${chatUserId}/`);
            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setChatMessages((prevMessages) => [...prevMessages, data]);
            };

            ws.current.onclose = () => {
                console.log('WebSocket closed');
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setError('WebSocket error'); // Handle WebSocket error
            };
        }

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [chatUserId]);

    const handleSendMessage = () => {
        if (ws.current && message.trim()) {
            ws.current.send(JSON.stringify({ message }));
            setMessage('');
        } else {
            setError('Message cannot be empty'); // Handle empty message
        }
    };

    const handleSendInterest = async (userId) => {
        try {
            await axios.post(
                'interests/',
                { to_user: userId },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            setError(''); // Clear error if successful
        } catch (err) {
            setError('Failed to send interest.'); // Handle error
        }
    };

    const handleConfirmInterest = async (interestId, status) => {
        try {
            await axios.post(
                `interests/${interestId}/handle/`,
                { status: status },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            const response = await axios.get('interests/received/', {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setReceivedRequests(response.data);
            setError(''); // Clear error if successful
        } catch (err) {
            setError(`Failed to ${status === 2 ? 'accept' : 'reject'} the interest.`); // Handle error
        }
    };

    const handleChat = (recipientId) => {
        setChatUserId(recipientId);
        setChatMessages([]);
    };

    return (
        <div>
            <h2>Dashboard</h2>

            <section>
                <h3>Users</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {users.map((user) => (
                        <div key={user.id} style={{ border: '1px solid #ddd', margin: '10px', padding: '10px', borderRadius: '8px', width: '200px' }}>
                            <h4>{user.username}</h4>
                            <button onClick={() => handleSendInterest(user.id)}>Send Request</button>
                            <button onClick={() => handleChat(user.id)}>Chat</button>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3>Received Requests</h3>
                <div>
                    {receivedRequests.map((request) => (
                        <div key={request.id} style={{ border: '1px solid #ddd', margin: '10px', padding: '10px', borderRadius: '8px' }}>
                            <p>{request.from_user.username} has sent you an interest request.</p>
                            <p>Status: {request.status}</p>
                            {request.status === 1 && (
                                <div>
                                    <button onClick={() => handleConfirmInterest(request.id, 2)} style={{ marginRight: '10px', backgroundColor: 'green', color: 'white' }}>Accept</button>
                                    <button onClick={() => handleConfirmInterest(request.id, 3)} style={{ backgroundColor: 'red', color: 'white' }}>Reject</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {chatUserId && (
                <section>
                    <h3>Chat with User {chatUserId}</h3>
                    <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', maxHeight: '300px', overflowY: 'scroll' }}>
                        {chatMessages.map((msg, index) => (
                            <div key={index}>
                                <strong>{msg.sender}:</strong> {msg.message}
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </section>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error */}
        </div>
    );
}

export default Dashboard;
