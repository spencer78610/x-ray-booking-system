import { useState } from 'react'
import PatientInfo from './components/PatientInfo'
import ExamDetails from './components/ExamDetails'
import Referral from './components/Referral'
import AppointmentScheduling from './components/AppointmentScheduling'
import Consent from './components/Consent'
import './App.css'

function App() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // collect + send all data here later
  }

  return (
    <div className="app-container">
      <h1>Diagnostic Imaging Booking</h1>

      <form onSubmit={handleSubmit} className="booking-form">
        <section className="form-section">
          <h2>Patient Information</h2>
          <PatientInfo />
        </section>

        <section className="form-section">
          <h2>Exam Details</h2>
          <ExamDetails />
        </section>

        <section className="form-section">
          <h2>Referral Information</h2>
          <Referral />
        </section>

        <section className="form-section">
          <h2>Appointment Scheduling</h2>
          <AppointmentScheduling />
        </section>

        <section className="form-section">
          <h2>Consent</h2>
          <Consent />
        </section>

        <button type="submit" className="submit-btn">
          Book Appointment
        </button>
      </form>
    </div>
  )
}

export default App