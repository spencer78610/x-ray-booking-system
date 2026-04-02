import React, { useState, useEffect } from 'react';
import LoginPage from './components/pages/LoginPage';
import CreateAccount from './components/pages/CreateAccount';
import BookingForm from './components/pages/BookingForm';
import ProfilePage from './components/pages/ProfilePage';
import StaffPage from './components/pages/StaffPage';
import CancelReschedule from './components/Features/Booking/CancelReschedule';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState('login');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appLoading, setAppLoading] = useState(true);

  // Check Firebase auth state on load — handles "Remember me"
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, "patients", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          const userData = docSnap.exists() ? docSnap.data() : {};
          const user = {
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            role: userData.role || 'patient',
          };
          setCurrentUser(user);
          setPage(userData.role === 'staff' ? 'staff' : 'profile');
        } catch (err) {
          console.error('Error fetching user data:', err);
          setCurrentUser(null);
          setPage('login');
        }
      } else {
        setCurrentUser(null);
        setPage('login');
      }
      setAppLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
    setPage('booking');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage('login');
  };

  // Show loading spinner while checking auth state
  if (appLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f4f6fb',
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
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
    if (currentUser?.role === 'staff') {
      setPage('staff');
      return null;
    }
    return (
      <BookingForm
        user={currentUser}
        onLogout={handleLogout}
        onGoToProfile={() => setPage('profile')}
      />
    );
  }

  if (page === 'profile') {
    if (currentUser?.role === 'staff') {
      setPage('staff');
      return null;
    }
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
          setSelectedAppointment(null);
          setPage('profile');
        }}
        onCancel={async () => {
          if (selectedAppointment?.id) {
            const apptRef = doc(db, "appointments", selectedAppointment.id);
            await updateDoc(apptRef, { status: "Cancelled" });
          }
          setSelectedAppointment(null);
          setPage('profile');
        }}
        onGoToProfile={() => setPage('profile')}
      />
    );
  }

  if (page === 'staff') {
    if (currentUser?.role === 'patient') {
      setPage('profile');
      return null;
    }
    return (
      <StaffPage
        user={currentUser}
        onLogout={handleLogout}
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