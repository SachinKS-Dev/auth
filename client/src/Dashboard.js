import React, { useState, useEffect } from 'react';
import axios from './axiosInstance';
import ChatComponent from './ChatComponent';

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [selectedChatUser, setSelectedChatUser] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch users
        const fetchUsers = async () => {
            try {
                const response = await axios.get('users/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users.');
            }
        };

        // Fetch received interest requests
        const fetchReceivedRequests = async () => {
            try {
                const response = await axios.get('interests/received/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setReceivedRequests(response.data);
            } catch (err) {
                setError('Failed to fetch received requests.');
            }
        };

        fetchUsers();
        fetchReceivedRequests();
    }, [token]);

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
            setMessage('Interest sent successfully!');
            setError('');
        } catch (err) {
            setError('Failed to send interest.');
            setMessage('');
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
            setMessage(`Interest ${status === 2 ? 'accepted' : 'rejected'} successfully!`);
            setError('');

            const response = await axios.get('interests/received/', {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setReceivedRequests(response.data);
        } catch (err) {
            setError(`Failed to ${status === 1 ? 'accept' : 'reject'} the interest.`);
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Dashboard</h2>

            <section>
                <h3>Users</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {users.map((user) => (
                        <div key={user.id} style={{
                            border: '1px solid #ddd',
                            margin: '10px',
                            padding: '10px',
                            borderRadius: '8px',
                            width: '200px'
                        }}>
                            <h4>{user.username}</h4>
                            <button onClick={() => handleSendInterest(user.id)}>Send Request</button>
                            <button onClick={() => setSelectedChatUser(user)}>Chat</button>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3>Received Requests</h3>
                <div>
                    {receivedRequests.map((request) => (
                        <div
                            key={request.id}
                            style={{
                                border: '1px solid #ddd',
                                margin: '10px',
                                padding: '10px',
                                borderRadius: '8px',
                            }}
                        >
                            <p>{request.from_user.username} has sent you an interest request.</p>
                            <p>Status: {request.status}</p>
                            {request.status === 1 && (
                                <div>
                                    <button
                                        onClick={() => handleConfirmInterest(request.id, 2)}
                                        style={{ marginRight: '10px', backgroundColor: 'green', color: 'white' }}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleConfirmInterest(request.id, 3)}
                                        style={{ backgroundColor: 'red', color: 'white' }}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {selectedChatUser && (
                <section>
                    <h3>Chat with {selectedChatUser.username}</h3>
                    <ChatComponent recipientId={selectedChatUser.id} />
                </section>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
}

export default Dashboard;
