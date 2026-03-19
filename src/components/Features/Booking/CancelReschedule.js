import React, { useState } from 'react';

function CancelReschedule({ formData, onReschedule, onCancel, onGoToProfile }) {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [action, setAction] = useState('');

const handleReschedule = () => {
  if (!newDate || !newTime) {
    alert('Please select a new date and time.');
    return;
  }
  onReschedule(newDate, newTime);
  setAction('rescheduled');
  setTimeout(() => {
    onGoToProfile();
  }, 3000);
};

  const handleCancel = () => {
    onCancel();
    setAction('cancelled');
  };

if (action === 'rescheduled') {
  return (
    <div className="cancel-reschedule-container">
      <h2>Appointment Rescheduled ✅</h2>
      <p>Your new appointment is on <strong>{newDate}</strong> at <strong>{newTime}</strong>.</p>
      <p>Redirecting you to your profile...</p>
    </div>
  );
}

  if (action === 'cancelled') {
    return (
      <div className="cancel-reschedule-container">
        <h2>Appointment Cancelled ❌</h2>
        <p>Your appointment has been successfully cancelled. We hope to see you soon!</p>
      </div>
    );
  }

  return (
    <div className="cancel-reschedule-container booking-form">
      <h2>Cancel or Reschedule Appointment</h2>
      <p>Current appointment: <strong>{formData?.appointmentDate || formData?.date}</strong> at <strong>{formData?.appointmentTime || formData?.time}</strong></p>

      <h3>Reschedule</h3>
      <label>New Date:
        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
      </label>

      <label>New Time:
        <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
      </label>
      <button onClick={handleReschedule} className="reschedule-btn">Confirm Reschedule</button>

      <h3>Cancel</h3>
      <p>If you wish to cancel your appointment, click below.</p>
      <button onClick={handleCancel} className="cancel-btn">Cancel Appointment</button>
    </div>
  );
}

export default CancelReschedule;