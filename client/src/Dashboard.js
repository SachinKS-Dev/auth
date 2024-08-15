import React, {useState, useEffect} from 'react';
import {Container, Typography, Grid, Dialog, IconButton, Paper, Snackbar, Alert} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from './axiosInstance';
import UserList from './UserList';
import ChatComponent from './ChatComponent';
import ReceivedRequests from "./ReceivedRequests";

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
    const [selectedChatUser, setSelectedChatUser] = useState(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

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
                setOpenSnackbar(true);
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
                setOpenSnackbar(true);
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
                setOpenSnackbar(true);
            }
        };

        fetchUsers();
        fetchReceivedRequests();
        fetchSentRequests();
    }, [token]);

    const handleSendInterest = async (userId) => {
        setOpenSnackbar(false); // Close Snackbar before setting new message/error
        try {
            await axios.post('interests/', {to_user: userId}, {
                headers: {Authorization: `Token ${token}`},
            });
            setMessage('Interest sent successfully!');
            setError('');
            setOpenSnackbar(true); // Reopen Snackbar

            // Update sentRequests state to include the new request
            const newRequest = {
                id: new Date().getTime(), // Assuming an ID is generated or use a proper ID if returned from the server
                to_user: {id: userId},
                status: 1,
            };
            setSentRequests((prevRequests) => [...prevRequests, newRequest]);

        } catch (err) {
            setError('Failed to send interest.');
            setMessage('');
            setOpenSnackbar(true); // Reopen Snackbar
        }
    };


    const handleConfirmInterest = async (interestId, status) => {
        setOpenSnackbar(false);
        try {
            await axios.post(`interests/${interestId}/handle/`, {status: status}, {
                headers: {Authorization: `Token ${token}`},
            });
            setMessage(`Interest ${status === 2 ? 'accepted' : 'rejected'} successfully!`);
            setError('');
            setOpenSnackbar(true);

            const response = await axios.get('interests/received/', {
                headers: {Authorization: `Token ${token}`},
            });
            setReceivedRequests(response.data);
        } catch (err) {
            setError(`Failed to ${status === 1 ? 'accept' : 'reject'} the interest.`);
            setMessage('');
            setOpenSnackbar(true);
        }
    };

    const handleChat = async (userId) => {
        setOpenSnackbar(false); // Ensure no previous messages are displayed
        try {
            const response = await axios.post('chatrooms/create_or_get/', {participant_id: userId}, {
                headers: {Authorization: `Token ${token}`},
            });
            setSelectedChatRoomId(response.data.chat_room_id);
            setSelectedChatUser(users.find(user => user.id === userId));
            setChatOpen(true);
            // No message is set here to avoid showing a Snackbar when starting a chat
        } catch (err) {
            setError('Failed to start chat.');
            setMessage('');
            setOpenSnackbar(true);
        }
    };


    const isChatAvailable = (userId) => {
        const acceptedReceivedRequest = receivedRequests.find(
            (request) => request.from_user.id === userId && request.status === 2
        );
        const acceptedSentRequest = sentRequests.find(
            (request) => request.to_user.id === userId && request.status === 2
        );

        if (acceptedReceivedRequest || acceptedSentRequest) {
            return 'chatAvailable';
        }

        const pendingSentRequest = sentRequests.find(
            (request) => request.to_user.id === userId && request.status === 1
        );

        if (pendingSentRequest) {
            return 'pending';
        }

        return 'noRequest';
    };

    const handleCloseChat = () => {
        setChatOpen(false);
        setSelectedChatRoomId(null);
        setSelectedChatUser(null);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="lg" sx={{mt: 2, borderRadius: 2}}>
            <Typography variant="h2" gutterBottom sx={{mb: 4, p: 2}}>
                {username}
            </Typography>

            <div style={{marginBottom: '16px'}}></div>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'}>
                    {error || message}
                </Alert>
            </Snackbar>

            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <Paper elevation={3} sx={{p: 2, borderRadius: 2, height: '100%'}}>
                        <Typography variant="h5" gutterBottom>Notifications</Typography>
                        <div style={{height: '400px', overflowY: 'auto'}}> {/* Scrolling added */}
                            <ReceivedRequests
                                receivedRequests={receivedRequests}
                                handleConfirmInterest={handleConfirmInterest}
                            />
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper elevation={3} sx={{p: 2, borderRadius: 2, height: '100%'}}>
                        <Typography variant="h5" gutterBottom>Users</Typography>
                        <div style={{
                            height: '400px',
                            overflowY: 'auto',
                            scrollbarWidth: 'none',   /* For Firefox */
                            msOverflowStyle: 'none',  /* For Internet Explorer and Edge */
                        }}>
                            {/* Hide scrollbar for WebKit browsers like Chrome, Safari, and Edge */}
                            <style jsx>{`
                              ::-webkit-scrollbar {
                                display: none;
                              }
                            `}</style>
                            <UserList
                                users={users}
                                handleSendInterest={handleSendInterest}
                                handleChat={handleChat}
                                isChatAvailable={isChatAvailable}
                            />
                        </div>
                    </Paper>
                </Grid>

            </Grid>


            <Dialog
                open={chatOpen}
                onClose={handleCloseChat}
                maxWidth="sm"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        overflowX: 'hidden',
                    },
                }}
            >
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleCloseChat}
                    aria-label="close"
                    style={{position: 'absolute', right: 8, top: 8}}
                >
                    <CloseIcon/>
                </IconButton>
                <ChatComponent chatRoomId={selectedChatRoomId} selectedChatUser={selectedChatUser}/>
            </Dialog>
        </Container>
    );
}

export default Dashboard;
