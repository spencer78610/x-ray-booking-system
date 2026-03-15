// I added a folder for pages and a folder for features. The pages folder will contain the main components that represent each page of the booking process, while the features folder will contain smaller, reusable components that are used within those pages. This structure helps to keep the code organized and makes it easier to manage as the application grows.

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookingForm from './components/pages/BookingForm';
import ProfilePage from './pages/ProfilePage';
import './App.css';
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to /booking */}
        <Route path="/" element={<Navigate to="/booking" replace />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}