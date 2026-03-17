import React, { useState } from 'react';
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
    <LoginPage
      onLogin={handleLogin}
      onGoToRegister={() => setPage('register')}
    />
  );
}