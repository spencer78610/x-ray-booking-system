import React from 'react';

function Confirmation({ formData }) {
  return (
    <div className="confirmation-container booking-form">
      <h2>Appointment Confirmation</h2>
      <p>Thank you, <strong>{formData.firstName} {formData.lastName}</strong>! Your appointment has been booked.</p>

      <h3>Appointment Summary</h3>
      <ul>
        <li><strong>Exam Type:</strong> {formData.examType}</li>
        <li><strong>Body Part:</strong> {formData.bodyPart}</li>
        <li><strong>Location:</strong> {formData.appointmentLocation}</li>
        <li><strong>Date:</strong> {formData.appointmentDate}</li>
        <li><strong>Time:</strong> {formData.appointmentTime}</li>
      </ul>

      <h3>Reminders</h3>
      <p>A confirmation has been sent to: <strong>{formData.email}</strong></p>
      <p>A reminder will be sent to: <strong>{formData.phoneNumber}</strong></p>
    </div>
  );
}

export default Confirmation;