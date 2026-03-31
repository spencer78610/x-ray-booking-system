import React, { useState } from 'react';
import LoginPage from './components/pages/LoginPage';
import CreateAccount from './components/pages/CreateAccount';
import BookingForm from './components/pages/BookingForm';
import ProfilePage from './components/pages/ProfilePage';
import StaffPage from './components/pages/StaffPage';
import CancelReschedule from './components/Features/Booking/CancelReschedule';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import './App.css';

// Pages folder contains main page components.
// Features folder contains smaller reusable components used within pages.

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState('login');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Route based on role after login
  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === 'staff') {
      setPage('staff');
    } else {
      setPage('profile');
    }
  };

  // New patients go to booking first
  const handleAccountCreated = (user) => {
    setCurrentUser(user);
    setPage('profile');
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
    // Block staff from booking page
    if (currentUser?.role === 'staff') {
      setPage('staff');
      return null;
    }
    return (
      <BookingForm
        user={currentUser}
        onLogout={() => setPage('login')}
        onGoToProfile={() => setPage('profile')}
      />
    );
  }

  if (page === 'profile') {
    // Block staff from patient profile
    if (currentUser?.role === 'staff') {
      setPage('staff');
      return null;
    }
    return (
      <ProfilePage
        user={currentUser}
        onLogout={() => setPage('login')}
        onBookAppointment={() => setPage('booking')}
        onReschedule={(appt) => { setSelectedAppointment(appt); setPage('reschedule'); }}
      />
    );
  }

  if (page === 'reschedule') {
    // Block staff from reschedule page
    if (currentUser?.role === 'staff') {
      setPage('staff');
      return null;
    }
    return (
      <CancelReschedule
        formData={selectedAppointment}
        onReschedule={async (newDate, newTime) => {
          if (selectedAppointment?.id) {
            const apptRef = doc(db, "appointments", selectedAppointment.id);
            await updateDoc(apptRef, { date: newDate, time: newTime });
          }
          setPage('profile');
        }}
        onCancel={async () => {
          if (selectedAppointment?.id) {
            const apptRef = doc(db, "appointments", selectedAppointment.id);
            await updateDoc(apptRef, { status: "Cancelled" });
          }
          setPage('profile');
        }}
        onGoToProfile={() => setPage('profile')}
      />
    );
  }

  if (page === 'staff') {
    // Block patients from staff page
    if (currentUser?.role === 'patient') {
      setPage('profile');
      return null;
    }
    return (
      <StaffPage
        user={currentUser}
        onLogout={() => setPage('login')}
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