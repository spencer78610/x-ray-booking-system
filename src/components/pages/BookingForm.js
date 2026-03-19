import { useState, useEffect } from 'react';
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

function BookingForm() {

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

  const [errors, setErrors] = useState({});

  const nextStep = () => {
    if (!validateStep()) return;
    setStep(prev => prev + 1);
  };

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

    // 🔥 Clear error when user edits field
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <FormStep stepNumber={1} totalSteps={steps.length} nextStep={nextStep}>
            <PatientInfo formData={formData} handleChange={handleChange} errors={errors} />
          </FormStep>
        );
      case 2:
        return (
          <FormStep stepNumber={2} totalSteps={steps.length} nextStep={nextStep} prevStep={prevStep}>
            <ExamDetails formData={formData} handleChange={handleChange} errors={errors} />
          </FormStep>
        );
      case 3:
        return (
          <FormStep stepNumber={3} totalSteps={steps.length} nextStep={nextStep} prevStep={prevStep}>
            <Referral formData={formData} handleChange={handleChange} errors={errors} />
          </FormStep>
        );
      case 4:
        return (
          <FormStep stepNumber={4} totalSteps={steps.length} nextStep={nextStep} prevStep={prevStep}>
            <AppointmentScheduling formData={formData} handleChange={handleChange} errors={errors} />
          </FormStep>
        );
      case 5:
        return (
          <FormStep stepNumber={5} totalSteps={steps.length} nextStep={nextStep} prevStep={prevStep}>
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
                <p><strong>Time:</strong> {formData.appointmentTime || "Flexible"}</p>
                <p><strong>Location:</strong> {formData.appointmentLocation}</p>
              </div>

            </div>
            <div className="confirmation-actions step-buttons">
              <button className="secondary-btn" onClick={() => setStep(5)}>Back</button>
              <button className="submit-btn" onClick={confirmSubmission} >Confirm Booking</button>

            </div>
          </>

        );
      case 7:
        return (
          <>
            <Confirmation formData={formData} />
            <button className="cR-btn" onClick={() => setStep(8)}>Cancel or Reschedule</button>
          </>
        );
      case 8:
        return (
          <>
            <CancelReschedule
              formData={formData}
              onReschedule={handleReschedule}
              onCancel={handleCancel}
            />
            <div className='step-buttons'>
              <button onClick={handleCancel} className="cancel-btn">Cancel Appointment</button>
              <button onClick={handleReschedule} className="reschedule-btn">Confirm Reschedule</button>
            </div>


          </>


        );
      default:
        return <PatientInfo />;
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        let newErrors = {};

        if (!formData.firstName) {
          newErrors.firstName = "First name is required";
        }

        if (!formData.lastName) {
          newErrors.lastName = "Last name is required";
        }

        if (!formData.email) {
          newErrors.email = "Email is required";
        }

        if (!formData.dob) {
          newErrors.dob = "Date of birth is required";
        }

        if (!formData.biologicalSex) {
          newErrors.biologicalSex = "Please select biological sex";
        }

        if (!formData.phoneNumber) {
          newErrors.phoneNumber = "Phone number is required";
        }

        if (!formData.address) {
          newErrors.address = "Address is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;

      case 2:
        let examErrors = {};

        if (!formData.examType) {
          examErrors.examType = "Please select an exam type";
        }

        if (!formData.specificExam) {
          examErrors.specificExam = "Please select a specific exam";
        }

        setErrors(examErrors);
        return Object.keys(examErrors).length === 0;

      case 3:
        if (!formData.referral) {
          setErrors({ ...errors, referral: "Please indicate if you have a referral." });
          return false;
        }

        if (formData.referral === "yes") {
          let referralErrors = {};

          if (!formData.physician) {
            referralErrors.physician = "Referring physician name is required";
          }

          if (!formData.clinic) {
            referralErrors.clinic = "Referring clinic name is required";
          }

          if (!formData.referralFile) {
            referralErrors.referralFile = "Please upload the referral document";
          }

          setErrors({ ...errors, ...referralErrors });
          return Object.keys(referralErrors).length === 0;
        }

        return true;

      case 4:
        let scheduleErrors = {};

        if (!formData.appointmentLocation) {
          scheduleErrors.appointmentLocation = "Please select a location";
        }

        if (!formData.appointmentDate) {
          scheduleErrors.appointmentDate = "Please select a date";
        }

        if (!formData.flexibleTiming && !formData.appointmentTime) {
          scheduleErrors.appointmentTime = "Please select a time";
        }

        setErrors(scheduleErrors);
        return Object.keys(scheduleErrors).length === 0;

      case 5:
        if (
          !formData.consent ||
          !formData.confirmInformation ||
          !formData.privacyPolicy ||
          !formData.cancelationPolicy
        ) {
          setErrors({
            consentGroup: "You must agree to all consent items before continuing."
          });
          return false;
        }

        setErrors({});
        return true;

      default:
        return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
      <h1>Book an Appointment</h1>

      {/* Progress & Breadcrumbs */}
      <ProgressBar currentStep={Math.min(step, steps.length)} totalSteps={steps.length} />
      <StepBreadcrumbs currentStep={Math.min(step, steps.length)} steps={steps} />

      {renderStep()}
    </div>
  );
}

export default BookingForm;