import { useState, useEffect } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import PatientInfo from '../Features/Booking/PatientInfo';
import ExamDetails from '../Features/Booking/ExamDetails';
import Referral from '../Features/Booking/Referral';
import AppointmentScheduling from '../Features/Booking/AppointmentScheduling';
import Consent from '../Features/Booking/Consent';
import CancelReschedule from '../Features/Booking/CancelReschedule';
import Confirmation from '../Features/Booking/Confirmation';
import FormStep from '../Features/Booking/FormStep';
import ProgressBar from '../Features/Booking/ProgressBar';
import StepBreadcrumbs from '../Features/Booking/Breadcrumbs';
// import './App.css';

function BookingForm({ user, onLogout, onGoToProfile }) {

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
          <>
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
            
          </div>
          <div className="confirmation-actions step-buttons">
              <button className="secondary-btn" onClick={() => setStep(1)}>Back</button>
              <button className="submit-btn" onClick={confirmSubmission} >Confirm Booking</button>

            </div>
          </>
         
        );
      case 7:
        return (
          <>
            <Confirmation formData={formData} />
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="cR-btn" style={{ width: "fit-content" }} onClick={() => setStep(8)}>Cancel or Reschedule</button>
              <button className="cR-btn" style={{ width: "fit-content" }} onClick={onGoToProfile}>Go to Profile</button>
            </div>
          </>
        );
      case 8:
        return (
          <>
            <CancelReschedule
              formData={formData}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
                onGoToProfile={onGoToProfile}
            />
            {/* <div className='step-buttons'>
              <button onClick={handleCancel} className="cancel-btn">Cancel Appointment</button>
              <button onClick={() => handleReschedule()} className="reschedule-btn">Confirm Reschedule</button>
            </div> */}


          </>


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

const confirmSubmission = async () => {
  console.log("FINAL SUBMISSION:", formData);
  
  // Save appointment to Firestore
  if (user?.uid) {
    await addDoc(collection(db, "appointments"), {
      uid: user.uid,
      type: formData.specificExam,
      date: formData.appointmentDate,
      time: formData.appointmentTime,
      doctor: "",
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    });
  }
  
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
      <h1>Book an Appointment</h1>

      {/* Progress & Breadcrumbs */}
      <ProgressBar currentStep={Math.min(step, steps.length)} totalSteps={steps.length} />
      <StepBreadcrumbs currentStep={Math.min(step, steps.length)} steps={steps} />

      {renderStep()}
    </div>
  );
}

export default BookingForm;