import { useState } from 'react';
import PatientInfo from './components/PatientInfo';
import ExamDetails from './components/ExamDetails';
import Referral from './components/Referral';
import AppointmentScheduling from './components/AppointmentScheduling';
import Consent from './components/Consent';
import './App.css';

function App() {
  // All form data in one object
  const [formData, setFormData] = useState({
    // PatientInfo
    firstName: '',
    lastName: '',
    dob: '',
    biologicalSex: '',
    phoneNumber: '',
    email: '',
    address: '',
    // ExamDetails
    examType: '',
    specificExam: '',
    bodyPart: '',
    side: '',
    notes: '',
    // Referral
    referral: '',
    physician: '',
    clinic: '',
    referralFile: null,
    // AppointmentScheduling
    appointmentLocation: '',
    appointmentDate: '',
    appointmentTime: '',
    flexibleTiming: false,
    // Consent
    consent: false,
    confirmInformation: false,
    privacyPolicy: false,
    cancelationPolicy: false
  });

  // Generic handleChange function
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    //  simple validation 
    if (!formData.consent || !formData.confirmInformation || !formData.privacyPolicy || !formData.cancelationPolicy) {
      alert("You must agree to all consent items before submitting.");
      return;
    }

    console.log("Booking submitted:", formData);

    // This is where we will send formData to a backend API
  };

  return (
    <div className="app-container">
      <h1>X-Ray & Ultrasound Booking</h1>

      {/* Single parent form */}
      <form onSubmit={handleSubmit} className="booking-form">
        <section className="form-section">
          <h2>Patient Information</h2>
          <PatientInfo formData={formData} handleChange={handleChange} />
        </section>

        <section className="form-section">
          <h2>Exam Details</h2>
          <ExamDetails formData={formData} handleChange={handleChange} />
        </section>

        <section className="form-section">
          <h2>Referral Information</h2>
          <Referral formData={formData} handleChange={handleChange} />
        </section>

        <section className="form-section">
          <h2>Appointment Scheduling</h2>
          <AppointmentScheduling formData={formData} handleChange={handleChange} />
        </section>

        <section className="form-section">
          <h2>Consent</h2>
          <Consent formData={formData} handleChange={handleChange} />
        </section>

        <button type="submit" className="submit-btn">Book Appointment</button>
      </form>
    </div>
  );
}

export default App;