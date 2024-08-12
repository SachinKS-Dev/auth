import React, {useState, useEffect} from 'react';
import {Container, Typography} from '@mui/material';
import axios from './axiosInstance';
import UserList from './UserList';
import ReceivedRequests from './ReceivedRequests';
import ChatSection from './ChatSection';

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
    const [selectedChatUser, setSelectedChatUser] = useState(null);

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('users/', {
                    headers: {Authorization: `Token ${token}`},
                });
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users.');
            }
        };

        const fetchReceivedRequests = async () => {
            try {
                const response = await axios.get('interests/received/', {
                    headers: {Authorization: `Token ${token}`},
                });
                setReceivedRequests(response.data);
            } catch (err) {
                setError('Failed to fetch received requests.');
            }
        };

        const fetchSentRequests = async () => {
            try {
                const response = await axios.get('interests/sent/', {
                    headers: {Authorization: `Token ${token}`},
                });
                setSentRequests(response.data);
            } catch (err) {
                setError('Failed to fetch sent requests.');
            }
        };

        fetchUsers();
        fetchReceivedRequests();
        fetchSentRequests();
    }, [token]);

    const handleSendInterest = async (userId) => {
        try {
            await axios.post('interests/', {to_user: userId}, {
                headers: {Authorization: `Token ${token}`},
            });
            setMessage('Interest sent successfully!');
            setError('');
        } catch (err) {
            setError('Failed to send interest.');
            setMessage('');
        }
    };

    const handleConfirmInterest = async (interestId, status) => {
        try {
            await axios.post(`interests/${interestId}/handle/`, {status: status}, {
                headers: {Authorization: `Token ${token}`},
            });
            setMessage(`Interest ${status === 2 ? 'accepted' : 'rejected'} successfully!`);
            setError('');

            const response = await axios.get('interests/received/', {
                headers: {Authorization: `Token ${token}`},
            });
            setReceivedRequests(response.data);
        } catch (err) {
            setError(`Failed to ${status === 1 ? 'accept' : 'reject'} the interest.`);
            setMessage('');
        }
    };

    const handleChat = async (userId) => {
        try {
            const response = await axios.post('chatrooms/create_or_get/', {participant_id: userId}, {
                headers: {Authorization: `Token ${token}`},
            });
            setSelectedChatRoomId(response.data.chat_room_id);
            setSelectedChatUser(users.find(user => user.id === userId));
            setError('');
        } catch (err) {
            setError('Failed to start chat.');
            setMessage('');
        }
    };

    const isChatAvailable = (userId) => {
        const acceptedReceivedRequest = receivedRequests.find(
            (request) => request.from_user.id === userId && request.status === 2
        );
        const acceptedSentRequest = sentRequests.find(
            (request) => request.to_user.id === userId && request.status === 2
        );
        return acceptedReceivedRequest || acceptedSentRequest;
    };

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Typography variant="h4" gutterBottom>
                Dashboard - {username}
            </Typography>

            {error && <Typography color="error">{error}</Typography>}
            {message && <Typography color="primary">{message}</Typography>}

            <section>
                <Typography variant="h5">Users</Typography>
                <UserList
                    users={users}
                    handleSendInterest={handleSendInterest}
                    handleChat={handleChat}
                    isChatAvailable={isChatAvailable}
                />
            </section>

            <section>
                <Typography variant="h5">Received Requests</Typography>
                <ReceivedRequests
                    receivedRequests={receivedRequests}
                    handleConfirmInterest={handleConfirmInterest}
                />
            </section>

            <ChatSection
                selectedChatRoomId={selectedChatRoomId}
                selectedChatUser={selectedChatUser}
            />
        </Container>
    );
}

export default Dashboard;
