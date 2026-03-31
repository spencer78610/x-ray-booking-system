import React, { useState, useEffect } from 'react';
import LoginPage from './components/pages/LoginPage';
import CreateAccount from './components/pages/CreateAccount';
import BookingForm from './components/pages/BookingForm';
import ProfilePage from './components/pages/ProfilePage';
import CancelReschedule from './components/Features/Booking/CancelReschedule';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    // ✅ Persist user across refresh
    const saved = sessionStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [page, setPage] = useState(() => {
    // ✅ Persist page across refresh
    return sessionStorage.getItem('currentPage') || 'login';
  });

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // ✅ Keep sessionStorage in sync whenever user or page changes
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    sessionStorage.setItem('currentPage', page);
  }, [page]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setPage('profile');
  };

  const handleAccountCreated = (user) => {
    setCurrentUser(user);
    setPage('booking');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage('login');
    sessionStorage.clear();
  };

  // ✅ Guard: if no user and trying to access protected page, go to login
  if (!currentUser && !['login', 'register'].includes(page)) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onGoToRegister={() => setPage('register')}
      />
    );
  }

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
        onLogout={handleLogout}
        onGoToProfile={() => setPage('profile')}
        onBookingComplete={() => setPage('profile')} // ✅ Redirect after submit
      />
    );
  }

  if (page === 'profile') {
    return (
      <ProfilePage
        user={currentUser}
        onLogout={handleLogout}
        onBookAppointment={() => setPage('booking')}
        onReschedule={(appt) => {
          setSelectedAppointment(appt);
          setPage('reschedule');
        }}
      />
    );
  }

  if (page === 'reschedule') {
    return (
      <CancelReschedule
        formData={selectedAppointment}
        onReschedule={async (newDate, newTime) => {
          if (selectedAppointment?.id) {
            const apptRef = doc(db, "appointments", selectedAppointment.id);
            await updateDoc(apptRef, { date: newDate, time: newTime });
          }
          setSelectedAppointment(null); // ✅ Clear selected appointment
          setPage('profile');
        }}
        onCancel={async () => {
          if (selectedAppointment?.id) {
            const apptRef = doc(db, "appointments", selectedAppointment.id);
            await updateDoc(apptRef, { status: "Cancelled" });
          }
          setSelectedAppointment(null); // ✅ Clear selected appointment
          setPage('profile');
        }}
        onGoToProfile={() => setPage('profile')}
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