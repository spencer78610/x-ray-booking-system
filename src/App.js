import React from 'react';
import BookingForm from './components/pages/BookingForm';
import LoginPage from './components/pages/LoginPage';
import './App.css';

// I added a folder for pages and a folder for features. The pages folder will contain the main components that represent each page of the booking process, while the features folder will contain smaller, reusable components that are used within those pages. This structure helps to keep the code organized and makes it easier to manage as the application grows.

export default function App() {
  return (
    <>
    <LoginPage />
    </>
    

  )
}