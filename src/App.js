import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main';
import Login from './pages/login';
function App() {



  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </Router>

  );
}

export default App;
