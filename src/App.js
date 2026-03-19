import React, { useState } from 'react';
import LoginPage from './components/pages/LoginPage';
import CreateAccount from './components/pages/CreateAccount';
import BookingForm from './components/pages/BookingForm';
import ProfilePage from './components/pages/ProfilePage';
import './App.css';

// Pages folder contains main page components.
// Features folder contains smaller reusable components used within pages.

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState('login');


  // Logged in → go to profile
  const handleLogin = (user) => {
    setCurrentUser(user);
    setPage('profile');
  };
  // Signed up → book first
    const handleAccountCreated = (user) => {
      setCurrentUser(user);
      setPage('booking');
    };

  if (page === 'register') {
    return (
      <CreateAccount
        onAccountCreated={handleAccountCreated}
        onGoToLogin={() => setPage('login')}
      />
    );
  }

  if (page === 'booking') {
return (
      <BookingForm
        user={currentUser}
        onLogout={() => setPage('login')}
        onGoToProfile={() => setPage('profile')}
      />
    );
  }

  if (page === 'profile') {
        return (
      <ProfilePage
        user={currentUser}
        onLogout={() => setPage('login')}
        onBookAppointment={() => setPage('booking')}
      />
    );
  }

  return (
        <LoginPage
      onLogin={handleLogin}
      onGoToRegister={() => setPage('register')}
    />
    
  );
}