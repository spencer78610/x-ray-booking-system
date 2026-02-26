
import { useState } from 'react';
import PatientInfo from './components/PatientInfo';
import ExamDetails from './components/ExamDetails';
import Referral from './components/Referral';
import AppointmentScheduling from './components/AppointmentScheduling';
import Consent from './components/Consent';
import CancelReschedule from './components/CancelReschedule';
import Confirmation from './components/Confirmation';
import './App.css';

import { useEffect } from 'react';


function App() {
  // All form data in one object
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("bookingFormData");
    return savedData ? JSON.parse(savedData) : {
      firstName: '',
      lastName: '',
      dob: '',
      biologicalSex: '',
      phoneNumber: '',
      email: '',
      address: '',
      examType: '',
      specificExam: '',
      bodyPart: '',
      side: '',
      notes: '',
      referral: '',
      physician: '',
      clinic: '',
      referralFile: null,
      appointmentLocation: '',
      appointmentDate: '',
      appointmentTime: '',
      flexibleTiming: false,
      consent: false,
      confirmInformation: false,
      privacyPolicy: false,
      cancelationPolicy: false
    };
  });

  useEffect(() => {
    // Avoid storing File objects (they can't be serialized)
    const { referralFile, ...serializableData } = formData;

    localStorage.setItem(
      "bookingFormData",
      JSON.stringify(serializableData)
    );
  }, [formData]);

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

    // Basic validation before confirmation
    if (!formData.firstName || !formData.lastName) {
      alert("Please complete required patient information.");
      return;
    }

    if (
      !formData.consent ||
      !formData.confirmInformation ||
      !formData.privacyPolicy ||
      !formData.cancelationPolicy
    ) {
      alert("You must agree to all consent items before continuing.");
      return;
    }

    // Move to confirmation step instead of final submit
    setStep("review");
  };

  const confirmSubmission = () => {
    console.log("FINAL SUBMISSION:", formData);

    setStep("confirmed");
  };

  const handleReschedule = (newDate, newTime) => {
    setFormData(prev => ({
      ...prev,
      appointmentDate: newDate,
      appointmentTime: newTime
    }));

    setStep("confirmed");
  };

  const handleCancel = () => {
    localStorage.removeItem("bookingFormData");

    setFormData({
      firstName: '',
      lastName: '',
      dob: '',
      biologicalSex: '',
      phoneNumber: '',
      email: '',
      address: '',
      examType: '',
      specificExam: '',
      bodyPart: '',
      side: '',
      notes: '',
      referral: '',
      physician: '',
      clinic: '',
      referralFile: null,
      appointmentLocation: '',
      appointmentDate: '',
      appointmentTime: '',
      flexibleTiming: false,
      consent: false,
      confirmInformation: false,
      privacyPolicy: false,
      cancelationPolicy: false
    });

    setStep("form");
  };

  return (
    <div className="app-container">
      <h1>X-Ray & Ultrasound Booking</h1>

      {step === "form" && (
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

          <button type="submit" className="submit-btn">
            Review & Confirm
          </button>
        </form>
      )}

      {step === "review" && (
        <div className="booking-form">
          <h2>Confirm Your Appointment</h2>

          <div className="confirmation-box">
            <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Exam:</strong> {formData.specificExam}</p>
            <p><strong>Date:</strong> {formData.appointmentDate}</p>
            <p><strong>Time:</strong> {formData.appointmentTime || "Flexible"}</p>
            <p><strong>Location:</strong> {formData.appointmentLocation}</p>
          </div>

          <div className="confirmation-actions">
            <button className="secondary-btn" onClick={() => setStep("form")}>
              Back & Edit
            </button>
            <button className="submit-btn" onClick={confirmSubmission}>
              Confirm Booking
            </button>
          </div>
        </div>
      )}

      {step === "confirmed" && (
        <>
          <Confirmation formData={formData} />
          <button
            className="secondary-btn"
            onClick={() => setStep("manage")}
          >
            Cancel or Reschedule
          </button>
        </>
      )}

      {step === "manage" && (
        <CancelReschedule
          formData={formData}
          onReschedule={handleReschedule}
          onCancel={handleCancel}
        />
      )}



    </div>
  );
}

export default App;

