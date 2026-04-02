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

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState('login');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === 'staff') {
      setPage('staff');
    } else {
      setPage('profile');
    }
  };

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
    if (currentUser?.role === 'staff') { setPage('staff'); return null; }
    return (
      <BookingForm
        user={currentUser}
        onLogout={() => setPage('login')}
        onGoToProfile={() => setPage('profile')}
      />
    );
  }

  if (page === 'profile') {
    if (currentUser?.role === 'staff') { setPage('staff'); return null; }
    return (
      <ProfilePage
        user={currentUser}
        onLogout={() => setPage('login')}
        onBookAppointment={() => setPage('booking')}
        onReschedule={(appt) => {
          setSelectedAppointment(appt);
          setPage('reschedule');
        }}
      />
    );
  }

  if (page === 'reschedule') {
    if (currentUser?.role === 'staff') { setPage('staff'); return null; }
    return (
      <CancelReschedule
        formData={selectedAppointment}
        onReschedule={async (newLocation, newDate, newTime, isFlexible) => {
          if (selectedAppointment?.id) {
            const apptRef = doc(db, "appointments", selectedAppointment.id);
            await updateDoc(apptRef, {
              appointmentLocation: newLocation,
              appointmentDate: newDate,
              appointmentTime: isFlexible ? 'Flexible' : newTime,
              flexibleTiming: isFlexible,
              status: 'Confirmed',
            });
          }
          setSelectedAppointment(null);
          setPage('profile');
        }}
        onCancel={async () => {
          if (selectedAppointment?.id) {
            const apptRef = doc(db, "appointments", selectedAppointment.id);
            await updateDoc(apptRef, { status: 'Cancelled' });
          }
          setSelectedAppointment(null);
          setPage('profile');
        }}
        onGoToProfile={() => {
          setSelectedAppointment(null);
          setPage('profile');
        }}
      />
    );
  }

  if (page === 'staff') {
    if (currentUser?.role === 'patient') { setPage('profile'); return null; }
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