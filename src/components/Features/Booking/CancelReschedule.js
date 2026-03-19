import React, { useState } from 'react';


function CancelReschedule({ formData, onReschedule, onCancel, onGoToProfile }) {

  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [action, setAction] = useState('');

  if (action === 'rescheduled') {
    return (
      <div className="cancel-reschedule-container">
        <h2>Appointment Rescheduled ✅</h2>
        <p>Your new appointment is on <strong>{newDate}</strong> at <strong>{newTime}</strong>.</p>
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
      <p>Current appointment: <strong>{formData.appointmentDate}</strong> at <strong>{formData.appointmentTime}</strong></p>

      <h3>Reschedule</h3>
      <label>New Date:
        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
      </label>
      <label>New Time:
        <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
      </label>

      <h3>Cancel</h3>
      <p>If you wish to cancel your appointment, click below.</p>
    </div>
  );
}

export default CancelReschedule;