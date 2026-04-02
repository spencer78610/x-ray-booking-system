import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
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

function BookingForm({ user, onLogout, onGoToProfile }) {

  const steps = ["Patient Info", "Exam Details", "Referral", "Appointment", "Consent", "Confirmation"];

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [appointmentId, setAppointmentId] = useState(null); // track saved doc ID

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("bookingFormData");
    return savedData ? JSON.parse(savedData) : {
      firstName: '', lastName: '', dob: '', biologicalSex: '',
      phoneNumber: '', email: '', address: '',
      examType: '', specificExam: '', bodyPart: '', side: '', notes: '',
      referral: '', physician: '', clinic: '', referralFile: null,
      appointmentLocation: '', appointmentDate: '', appointmentTime: '',
      flexibleTiming: false,
      consent: false, confirmInformation: false,
      privacyPolicy: false, cancelationPolicy: false
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
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = (currentStep) => {
    const e = {};
    if (currentStep === 1) {
      if (!formData.firstName.trim()) e.firstName = 'First name is required.';
      if (!formData.lastName.trim())  e.lastName  = 'Last name is required.';
      if (!formData.dob)              e.dob       = 'Date of birth is required.';
      if (!formData.biologicalSex)    e.biologicalSex = 'Please select a biological sex.';
      if (!formData.phoneNumber.trim()) e.phoneNumber = 'Phone number is required.';
      if (!formData.email.trim())     e.email = 'Email is required.';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Please enter a valid email.';
      if (!formData.address.trim())   e.address = 'Address is required.';
    }
    if (currentStep === 2) {
      if (!formData.examType)     e.examType     = 'Please select an exam type.';
      if (!formData.specificExam) e.specificExam = 'Please select a specific exam.';
    }
    if (currentStep === 3) {
      if (!formData.referral) e.referral = 'Please indicate whether you have a referral.';
      if (formData.referral === 'yes') {
        if (!formData.physician.trim()) e.physician    = 'Referring physician name is required.';
        if (!formData.clinic.trim())    e.clinic       = 'Referring clinic name is required.';
        // if (!formData.referralFile)     e.referralFile = 'Please upload your referral document.';
      }
    }
    if (currentStep === 4) {
      if (!formData.appointmentLocation) e.appointmentLocation = 'Please select a location.';
      if (!formData.appointmentDate)     e.appointmentDate     = 'Please select a date.';
      if (!formData.flexibleTiming && !formData.appointmentTime)
        e.appointmentTime = 'Please select a time or check flexible timing.';
    }
    if (currentStep === 5) {
      if (!formData.consent || !formData.confirmInformation ||
          !formData.privacyPolicy || !formData.cancelationPolicy) {
        e.consentGroup = 'You must agree to all items before continuing.';
      }
    }
    return e;
  };

  const nextStep = (currentStep) => {
    const e = validateStep(currentStep);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setErrors({});
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const e2 = validateStep(5);
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setErrors({});
    setStep(6);
  };

  const confirmSubmission = async () => {
    try {
      if (user?.uid) {
        const docRef = await addDoc(collection(db, "appointments"), {
          uid: user.uid,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dob: formData.dob,
          biologicalSex: formData.biologicalSex,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          address: formData.address,
          examType: formData.examType,
          specificExam: formData.specificExam,
          bodyPart: formData.bodyPart,
          side: formData.side,
          notes: formData.notes,
          referral: formData.referral,
          physician: formData.physician,
          clinic: formData.clinic,
          appointmentLocation: formData.appointmentLocation,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.flexibleTiming ? 'Flexible' : formData.appointmentTime,
          flexibleTiming: formData.flexibleTiming,
          status: 'Confirmed',
          createdAt: new Date().toISOString(),
        });
        setAppointmentId(docRef.id); // save the doc ID for reschedule/cancel
      }
      localStorage.removeItem("bookingFormData");
      setStep(7);
    } catch (err) {
      console.error("Failed to save appointment:", err);
      alert("There was a problem saving your appointment. Please try again.");
    }
  };

  // Updates Firestore and local state
  const handleReschedule = async (newLocation, newDate, newTime, isFlexible) => {
    try {
      if (user?.uid && appointmentId) {
        const apptRef = doc(db, "appointments", appointmentId);
        await updateDoc(apptRef, {
          appointmentLocation: newLocation,
          appointmentDate: newDate,
          appointmentTime: isFlexible ? 'Flexible' : newTime,
          flexibleTiming: isFlexible,
          status: 'Confirmed',
        });
      }
      setFormData(prev => ({
        ...prev,
        appointmentLocation: newLocation,
        appointmentDate: newDate,
        appointmentTime: newTime,
        flexibleTiming: isFlexible,
      }));
      setStep(7);
    } catch (err) {
      console.error("Failed to reschedule appointment:", err);
      alert("There was a problem rescheduling. Please try again.");
    }
  };

  const handleCancel = async () => {
    try {
      if (user?.uid && appointmentId) {
        const apptRef = doc(db, "appointments", appointmentId);
        await updateDoc(apptRef, { status: 'Cancelled' });
      }
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
    }
    localStorage.removeItem("bookingFormData");
    setFormData({
      firstName: '', lastName: '', dob: '', biologicalSex: '',
      phoneNumber: '', email: '', address: '',
      examType: '', specificExam: '', bodyPart: '', side: '', notes: '',
      referral: '', physician: '', clinic: '', referralFile: null,
      appointmentLocation: '', appointmentDate: '', appointmentTime: '',
      flexibleTiming: false,
      consent: false, confirmInformation: false,
      privacyPolicy: false, cancelationPolicy: false
    });
    setAppointmentId(null);
    setStep(1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <FormStep stepNumber={1} totalSteps={steps.length} nextStep={() => nextStep(1)}>
            <PatientInfo formData={formData} handleChange={handleChange} errors={errors} />
          </FormStep>
        );
      case 2:
        return (
          <FormStep stepNumber={2} totalSteps={steps.length} nextStep={() => nextStep(2)} prevStep={prevStep}>
            <ExamDetails formData={formData} handleChange={handleChange} errors={errors} />
          </FormStep>
        );
      case 3:
        return (
          <FormStep stepNumber={3} totalSteps={steps.length} nextStep={() => nextStep(3)} prevStep={prevStep}>
            <Referral formData={formData} handleChange={handleChange} errors={errors} />
          </FormStep>
        );
      case 4:
        return (
          <FormStep stepNumber={4} totalSteps={steps.length} nextStep={() => nextStep(4)} prevStep={prevStep}>
            <AppointmentScheduling formData={formData} handleChange={handleChange} errors={errors} />
          </FormStep>
        );
      case 5:
        return (
          <FormStep stepNumber={5} totalSteps={steps.length} handleSubmit={handleSubmit} prevStep={prevStep}>
            <Consent formData={formData} handleChange={handleChange} errors={errors} />
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
                <p><strong>Time:</strong> {formData.flexibleTiming ? 'Flexible' : formData.appointmentTime}</p>
                <p><strong>Location:</strong> {formData.appointmentLocation}</p>
              </div>
            </div>
            <div className="confirmation-actions step-buttons">
              <button className="secondary-btn" onClick={() => setStep(5)}>Back</button>
              <button className="submit-btn" onClick={confirmSubmission}>Confirm Booking</button>
            </div>
          </>
        );
      case 7:
        return (
          <>
            <Confirmation formData={formData} />
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="cR-btn" style={{ width: "fit-content" }} onClick={() => setStep(8)}>
                Cancel or Reschedule
              </button>
              <button className="cR-btn" style={{ width: "fit-content" }} onClick={onGoToProfile}>
                Go to Profile
              </button>
            </div>
          </>
        );
      case 8:
        return (
          <CancelReschedule
            formData={formData}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
            onGoToProfile={onGoToProfile}
          />
        );
      default:
        return <PatientInfo />;
    }
  };

  return (
    <div className="app-container">
      <h1>Book an Appointment</h1>
      <ProgressBar currentStep={Math.min(step, steps.length)} totalSteps={steps.length} />
      <StepBreadcrumbs currentStep={Math.min(step, steps.length)} steps={steps} />
      {renderStep()}
    </div>
  );
}

export default BookingForm;