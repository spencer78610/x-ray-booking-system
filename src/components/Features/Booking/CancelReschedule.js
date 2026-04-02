import React, { useState, useEffect } from 'react';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';

const clinicHours = {
  "440 Boler Road": {
    mon: ["07:00", "21:00"], tue: ["07:00", "21:00"], wed: ["07:00", "21:00"],
    thu: ["07:00", "21:00"], fri: ["08:00", "16:00"]
  },
  "595 Bradley Avenue": {
    mon: ["07:00", "21:00"], tue: ["07:00", "21:00"], wed: ["07:00", "21:00"],
    thu: ["07:00", "21:00"], fri: ["08:00", "16:00"], sat: ["08:00", "15:00"]
  },
  "450 Central Avenue": {
    mon: ["08:00", "16:00"], tue: ["08:00", "16:00"], wed: ["08:00", "16:00"],
    thu: ["08:00", "16:00"], fri: ["08:00", "16:00"]
  },
  "1657 Dundas Street East": {
    mon: ["08:00", "16:00"], tue: ["08:00", "16:00"], wed: ["08:00", "16:00"],
    thu: ["08:00", "16:00"], fri: ["08:00", "16:00"]
  },
  "3209 Wonderland Road South": {
    mon: ["08:00", "16:00"], tue: ["08:00", "16:00"], wed: ["08:00", "16:00"],
    thu: ["08:00", "16:00"], fri: ["08:00", "16:00"]
  }
};

const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const getDayKey = (dateString) => {
  const [year, month, day] = dateString.split("-");
  const date = new Date(year, month - 1, day);
  return days[date.getDay()];
};

const generateTimeSlots = (start, end) => {
  const slots = [];
  let current = new Date(`1970-01-01T${start}:00`);
  const finish = new Date(`1970-01-01T${end}:00`);
  while (current < finish) {
    slots.push(current.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    current.setMinutes(current.getMinutes() + 30);
  }
  return slots;
};

function CancelReschedule({ formData, onReschedule, onCancel, onGoToProfile }) {
  const [newLocation, setNewLocation] = useState(formData?.appointmentLocation || '');
  const [newDate, setNewDate] = useState(formData?.appointmentDate || '');
  const [newTime, setNewTime] = useState('');
  const [isFlexible, setIsFlexible] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [errors, setErrors] = useState({});
  const [action, setAction] = useState('');

  // Fetch blocked slots and booked appointments once on mount
  useEffect(() => {
    const fetchUnavailable = async () => {
      try {
        const [blockedSnap, appointmentsSnap] = await Promise.all([
          getDocs(collection(db, 'blockedSlots')),
          getDocs(collection(db, 'appointments')),
        ]);
        setBlockedSlots(
          blockedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        );
        setBookedAppointments(
          appointmentsSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(a =>
              a.status !== 'Cancelled' &&
              a.id !== formData?.id  // exclude the current appointment being rescheduled
            )
        );
      } catch (err) {
        console.error('Error fetching unavailable slots:', err);
      }
    };
    fetchUnavailable();
  }, [formData?.id]);

  // Recompute time slots whenever location or date changes
  useEffect(() => {
    if (!newLocation || !newDate) { setAvailableSlots([]); return; }
    const schedule = clinicHours[newLocation];
    const dayKey = getDayKey(newDate);
    if (!schedule || !schedule[dayKey]) { setAvailableSlots([]); return; }
    const [start, end] = schedule[dayKey];
    setAvailableSlots(generateTimeSlots(start, end));
    setNewTime('');
  }, [newLocation, newDate]);

  const isDateAvailable = (date) => {
    if (!newLocation) return false;
    const schedule = clinicHours[newLocation];
    const dayKey = days[date.getDay()];
    return schedule && schedule[dayKey];
  };

  const isBlocked = (time) => {
    return blockedSlots.some(slot =>
      slot.location === newLocation &&
      slot.date === newDate &&
      slot.time === time
    );
  };

  const isBooked = (time) => {
    return bookedAppointments.some(appt =>
      appt.appointmentLocation === newLocation &&
      appt.appointmentDate === newDate &&
      appt.appointmentTime === time
    );
  };

  const isUnavailable = (time) => isBlocked(time) || isBooked(time);

  const handleReschedule = () => {
    const e = {};
    if (!newLocation) e.newLocation = 'Please select a location.';
    if (!newDate) e.newDate = 'Please select a date.';
    if (!isFlexible && !newTime) e.newTime = 'Please select a time or check flexible timing.';
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onReschedule(newLocation, newDate, newTime, isFlexible);
    setAction('rescheduled');
    setTimeout(() => onGoToProfile(), 3000);
  };

  const handleCancel = () => {
    onCancel();
    setAction('cancelled');
  };

  if (action === 'rescheduled') {
    return (
      <div className="app-container">
        <div className="booking-form confirmation-container">
          <h2>✅ Appointment Rescheduled!</h2>
          <p>Your new appointment is on <strong>{newDate}</strong> at <strong>{isFlexible ? 'Flexible' : newTime}</strong>.</p>
          <p className="form-warning">Redirecting to your profile...</p>
        </div>
      </div>
    );
  }

  if (action === 'cancelled') {
    return (
      <div className="app-container">
        <div className="booking-form confirmation-container">
          <h2>❌ Appointment Cancelled</h2>
          <p>Your appointment has been successfully cancelled. We hope to see you soon!</p>
          <div className="step-buttons" style={{ marginTop: 20 }}>
            <button className="submit-btn" type="button" onClick={onGoToProfile}>
              Return to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="booking-form">
        <h2>Cancel or Reschedule</h2>

        {/* Current appointment summary */}
        <div className="confirmation-box">
          <p><strong>Current Location:</strong> {formData?.appointmentLocation || 'N/A'}</p>
          <p><strong>Current Date:</strong> {formData?.appointmentDate || 'N/A'}</p>
          <p><strong>Current Time:</strong> {formData?.flexibleTiming ? 'Flexible' : (formData?.appointmentTime || 'N/A')}</p>
        </div>

        <h3>Select a New Appointment</h3>

        <div className="form-grid">

          {/* Location */}
          <div className="form-group">
            <label>Preferred Location</label>
            <select
              name="newLocation"
              value={newLocation}
              className={errors.newLocation ? 'error' : ''}
              onChange={(e) => {
                setNewLocation(e.target.value);
                setNewTime(''); // reset time only — date stays selected
                setErrors(prev => ({ ...prev, newLocation: '' }));
              }}
            >
              <option value="">Select a location</option>
              <option value="440 Boler Road">440 Boler Road</option>
              <option value="595 Bradley Avenue">595 Bradley Avenue</option>
              <option value="450 Central Avenue">450 Central Avenue</option>
              <option value="1657 Dundas Street East">1657 Dundas Street East</option>
              <option value="3209 Wonderland Road South">3209 Wonderland Road South</option>
            </select>
            {errors.newLocation && <p className="error-text">{errors.newLocation}</p>}
          </div>

          {/* Calendar */}
          <div className="form-group">
            <label>Preferred Date</label>
            <Calendar
              onChange={(date) => {
                setNewDate(date.toISOString().split("T")[0]);
                setErrors(prev => ({ ...prev, newDate: '' }));
              }}
              tileDisabled={({ date }) => date < new Date() || !isDateAvailable(date)}
              className={errors.newDate ? 'error' : ''}
            />
            {errors.newDate && <p className="error-text">{errors.newDate}</p>}
          </div>

          {/* Time slots */}
          {availableSlots.length > 0 && (
            <div className="form-group full-width">
              <label>Available Time Slots</label>
              <div className={`time-slots ${errors.newTime ? 'error' : ''}`}>
                {availableSlots.map((slot) => {
                  const unavailable = isUnavailable(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={unavailable}
                      className={`time-slot
                        ${newTime === slot ? 'selected' : ''}
                        ${unavailable ? 'booked' : ''}
                      `}
                      onClick={() => {
                        if (!unavailable) {
                          setNewTime(slot);
                          setErrors(prev => ({ ...prev, newTime: '' }));
                        }
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {errors.newTime && <p className="error-text">{errors.newTime}</p>}
            </div>
          )}

          {/* Flexible timing */}
          <div className="form-group full-width">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isFlexible}
                onChange={(e) => {
                  setIsFlexible(e.target.checked);
                  setErrors(prev => ({ ...prev, newTime: '' }));
                }}
              />
              I am flexible with appointment timing
            </label>
          </div>

        </div>

        <div className="step-buttons">
          <button className="submit-btn" type="button" onClick={handleReschedule}>
            Confirm Reschedule
          </button>
          <button className="secondary-btn" type="button" onClick={handleCancel}>
            Cancel Appointment
          </button>
        </div>

      </div>
    </div>
  );
}

export default CancelReschedule;