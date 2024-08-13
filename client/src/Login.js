import React, { useState } from 'react';
import axios from './axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('login/', { username, password });
            localStorage.setItem('token', response.data.token); // Store token in localStorage
            localStorage.setItem('username', username); // Store username in localStorage
            setMessage('Login successful!');
            setError('');
            navigate('/dashboard');
        } catch (err) {
            setError('Login failed.');
            setMessage('');
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, mt: 10 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                    {error && (
                        <Typography color="error" align="center" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                    {message && (
                        <Typography color="primary" align="center" sx={{ mt: 2 }}>
                            {message}
                        </Typography>
                    )}
                </form>
            </Paper>
        </Container>
    );
}

export default Login;
