import { useState, useEffect } from 'react';
import PatientInfo from './components/PatientInfo';
import ExamDetails from './components/ExamDetails';
import Referral from './components/Referral';
import AppointmentScheduling from './components/AppointmentScheduling';
import Consent from './components/Consent';
import CancelReschedule from './components/CancelReschedule';
import Confirmation from './components/Confirmation';
import FormStep from './components/FormStep';
import ProgressBar from './components/ProgressBar';
import './App.css';

function App() {

  // Progress bar steps
  const steps = [
    "Patient Info",
    "Exam Details",
    "Referral",
    "Appointment",
    "Consent",
    "Confirmation"
  ];

  const [step, setStep] = useState(1);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // Will use this data later for the db
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("bookingFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
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
    const { referralFile, ...serializableData } = formData;
    localStorage.setItem("bookingFormData", JSON.stringify(serializableData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value
    }));
  };

  //  Step Breadcrumbs Component
  const StepBreadcrumbs = ({ currentStep, steps }) => (
    <div className="breadcrumbs">
      {steps.map((label, index) => {
        const isActive = index + 1 === currentStep;
        return (
          <span key={index} className={isActive ? "active-step" : ""}>
            {label} {index < steps.length - 1 && "/ "}
          </span>
        );
      })}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <FormStep stepNumber={1} totalSteps={steps.length} nextStep={nextStep}>
            <PatientInfo formData={formData} handleChange={handleChange} />
          </FormStep>
        );
      case 2:
        return (
          <FormStep stepNumber={2} totalSteps={steps.length} nextStep={nextStep} prevStep={prevStep}>
            <ExamDetails formData={formData} handleChange={handleChange} />
          </FormStep>
        );
      case 3:
        return (
          <FormStep stepNumber={3} totalSteps={steps.length} nextStep={nextStep} prevStep={prevStep}>
            <Referral formData={formData} handleChange={handleChange} />
          </FormStep>
        );
      case 4:
        return (
          <FormStep stepNumber={4} totalSteps={steps.length} nextStep={nextStep} prevStep={prevStep}>
            <AppointmentScheduling formData={formData} handleChange={handleChange} />
          </FormStep>
        );
      case 5:
        return (
          <FormStep stepNumber={5} totalSteps={steps.length} handleSubmit={handleSubmit} prevStep={prevStep}>
            <Consent formData={formData} handleChange={handleChange} />
          </FormStep>
        );
      case 6:
        return (
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
              <button className="secondary-btn" onClick={() => setStep(1)}>Back</button>
              <button className="submit-btn" onClick={confirmSubmission} >Confirm Booking</button>
              
            </div>
          </div>
        );
      case 7:
        return (
          <>
            <Confirmation formData={formData} />
            <button className="secondary-btn" onClick={() => setStep(8)}>Cancel or Reschedule</button>
          </>
        );
      case 8:
        return (
          <CancelReschedule
            formData={formData}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
          />
        );
      default:
        return <PatientInfo />;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) {
      alert("Please complete required patient information.");
      return;
    }
    if (!formData.consent || !formData.confirmInformation || !formData.privacyPolicy || !formData.cancelationPolicy) {
      alert("You must agree to all consent items before continuing.");
      return;
    }

    setStep(6);
  };

  const confirmSubmission = () => {
    console.log("FINAL SUBMISSION:", formData);
    setStep(7);
  };

  const handleReschedule = (newDate, newTime) => {
    setFormData(prev => ({ ...prev, appointmentDate: newDate, appointmentTime: newTime }));
    setStep(7);
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
    setStep(1);
  };

  return (
    <div className="app-container">
      <h1>X-Ray & Ultrasound Booking</h1>

      {/* Progress & Breadcrumbs */}
      <ProgressBar currentStep={Math.min(step, steps.length)} totalSteps={steps.length} />
      <StepBreadcrumbs currentStep={Math.min(step, steps.length)} steps={steps} />

      {renderStep()}
    </div>
  );
}

export default App;