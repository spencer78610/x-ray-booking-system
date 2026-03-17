// I added a folder for pages and a folder for features. The pages folder will contain the main components that represent each page of the booking process, while the features folder will contain smaller, reusable components that are used within those pages. This structure helps to keep the code organized and makes it easier to manage as the application grows.

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './components/pages/LoginPage';
import CreateAccount from './components/pages/CreateAccount';
import BookingForm from './components/pages/BookingForm';
import ProfilePage from './components/pages/ProfilePage';
import './App.css';

export default function App() {
  const [page, setPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === 'patient') {
      setPage('booking');
    } else {
      setPage('profile');
    }
  };

  if (page === 'register') {
    return (
      <CreateAccount
        onAccountCreated={() => setPage('login')}
        onGoToLogin={() => setPage('login')}
      />
    );
  }

  if (page === 'booking') {
    return <BookingForm user={currentUser} onLogout={() => setPage('login')} />;
  }

  if (page === 'profile') {
    return <ProfilePage user={currentUser} onLogout={() => setPage('login')} />;
  }

  return (
    <>
    <LoginPage
      onLogin={handleLogin}
      onGoToRegister={() => setPage('register')}
    />
    <Router>
      <Routes>
        {/* Default route redirects to /booking */}
        {/* <Route path="/" element={<Navigate to="/booking" replace />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </Router>
    </>
  );
}