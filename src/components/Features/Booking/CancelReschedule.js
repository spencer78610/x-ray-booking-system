import React, { useState } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

  .cr-root {
    min-height: 100vh;
    background: #f4f6fb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    padding: 24px;
  }

  .cr-card {
    background: white;
    border-radius: 16px;
    border: 0.5px solid #e5e7eb;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    padding: 2rem;
    width: 100%;
    max-width: 520px;
  }

  .cr-header {
    margin-bottom: 24px;
  }

  .cr-title {
    font-size: 22px;
    font-weight: 600;
    color: #1a3c6e;
    margin-bottom: 8px;
  }

  .cr-current {
    background: #e8f0fb;
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 14px;
    color: #1a3c6e;
  }

  .cr-section {
    margin-top: 24px;
  }

  .cr-section-title {
    font-size: 15px;
    font-weight: 600;
    color: #1a3c6e;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1.5px solid #e5e7eb;
  }

  .cr-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  .cr-field label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 6px;
  }

  .cr-field input {
    width: 100%;
    padding: 10px 12px;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1a3c6e;
    background: #f9fafb;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }

  .cr-field input:focus {
    border-color: #1a6bcc;
    background: white;
    box-shadow: 0 0 0 3px rgba(26,107,204,0.1);
  }

  .cr-btn-reschedule {
    width: 100%;
    padding: 11px;
    background: linear-gradient(135deg, #1a3c6e, #1a6bcc);
    color: white;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
  }

  .cr-btn-reschedule:hover { opacity: 0.92; }
  .cr-btn-reschedule:active { transform: scale(0.99); }

  .cr-divider {
    border: none;
    border-top: 1.5px solid #e5e7eb;
    margin: 24px 0;
  }

  .cr-cancel-box {
    background: #fff5f5;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .cr-cancel-text {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;
  }

  .cr-btn-cancel {
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 9px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.2s;
    flex-shrink: 0;
  }

  .cr-btn-cancel:hover { opacity: 0.88; }

  .cr-success {
    text-align: center;
    padding: 2rem;
  }

  .cr-success-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .cr-success-title {
    font-size: 20px;
    font-weight: 600;
    color: #1a3c6e;
    margin-bottom: 8px;
  }

  .cr-success-sub {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.6;
  }

  .cr-redirect {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
    font-size: 13px;
    color: #1a6bcc;
  }

  .cr-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid #e5e7eb;
    border-top-color: #1a6bcc;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

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
    setTimeout(() => onGoToProfile(), 3000);
  };

  const handleCancel = () => {
    onCancel();
    setAction('cancelled');
  };

  if (action === 'rescheduled') {
    return (
      <>
        <style>{styles}</style>
        <div className="cr-root">
          <div className="cr-card">
            <div className="cr-success">
              <div className="cr-success-icon">✅</div>
              <div className="cr-success-title">Appointment Rescheduled!</div>
              <div className="cr-success-sub">
                Your new appointment is on <strong>{newDate}</strong> at <strong>{newTime}</strong>.
              </div>
              <div className="cr-redirect">
                <div className="cr-spinner"></div>
                Redirecting to your profile...
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (action === 'cancelled') {
    return (
      <>
        <style>{styles}</style>
        <div className="cr-root">
          <div className="cr-card">
            <div className="cr-success">
              <div className="cr-success-icon">❌</div>
              <div className="cr-success-title">Appointment Cancelled</div>
              <div className="cr-success-sub">
                Your appointment has been successfully cancelled. We hope to see you soon!
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="cr-root">
        <div className="cr-card">
          <div className="cr-header">
            <div className="cr-title">Cancel or Reschedule</div>
            <div className="cr-current">
              📅 Current appointment: <strong>{formData?.appointmentDate || formData?.date}</strong> at <strong>{formData?.appointmentTime || formData?.time}</strong>
            </div>
          </div>

          <div className="cr-section">
            <div className="cr-section-title">Reschedule</div>
            <div className="cr-fields">
              <div className="cr-field">
                <label>New Date</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              </div>
              <div className="cr-field">
                <label>New Time</label>
                <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
              </div>
            </div>
            <button onClick={handleReschedule} className="cr-btn-reschedule">
              Confirm Reschedule
            </button>
          </div>

          <hr className="cr-divider" />

          <div className="cr-cancel-box">
            <div className="cr-cancel-text">
              Want to cancel instead? This action cannot be undone.
            </div>
            <button onClick={handleCancel} className="cr-btn-cancel">
              Cancel Appointment
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CancelReschedule;