import axios from 'axios';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import logo from '../assets/images/newspaper.png'

function Navbar() {
  return (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'white',
        zIndex: 1000,
        padding: '10px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
            <div><img src={logo} width={40}/></div>
    </div>
  );
}

export default Navbar;
