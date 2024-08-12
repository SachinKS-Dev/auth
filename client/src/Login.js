// src/Login.js
import React, {useState} from 'react';
import axios from './axiosInstance';
import {useNavigate} from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('login/', {username, password});
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
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button type="submit">Login</button>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {message && <p style={{color: 'green'}}>{message}</p>}
            </form>
        </div>
    );
}

export default Login;
