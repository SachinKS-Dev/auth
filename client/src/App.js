// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container, Box, Typography, Link } from '@mui/material';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Container maxWidth={false} sx={{ background: 'linear-gradient(to right, #000428, #004e92)', }}>
        <Box
          className="App"
          sx={{
            // background: 'linear-gradient(to right, #000428, #004e92)',
            borderRadius: 2,
            padding: 3,
            color: '#fff',
            textAlign: 'center',
            minHeight: '100vh',
          }}
        >
          <header className="App-header">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <Typography variant="h6">
                    <Link href="/register" color="inherit">Register</Link> | <Link href="/login" color="inherit">Login</Link>
                  </Typography>
                }
              />
              <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
              />
            </Routes>
          </header>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
