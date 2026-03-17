import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import CreateAccount from './components/pages/CreateAccount';
import BookingForm from './components/pages/BookingForm';
import ProfilePage from './components/pages/ProfilePage';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };
  

  return (
    <BookingForm />
  );
}