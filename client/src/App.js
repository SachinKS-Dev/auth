// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './Register';
import Login from './Login';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h5>Wallet</h5>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<p>Home Page. <a href="/register">Register</a> | <a href="/login">Login</a></p>} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
