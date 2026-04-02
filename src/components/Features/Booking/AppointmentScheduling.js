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

export default function AppointmentScheduling({ formData, handleChange, errors }) {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [bookedAppointments, setBookedAppointments] = useState([]);

  // Fetch both blocked slots and existing appointments on mount
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

        // Only treat confirmed appointments as booked — cancelled ones free the slot back up
        setBookedAppointments(
          appointmentsSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(a => a.status !== 'Cancelled')
        );
      } catch (err) {
        console.error('Error fetching unavailable slots:', err);
      }
    };
    fetchUnavailable();
  }, []);

  // Recompute available slots when location or date changes
  useEffect(() => {
    if (!formData.appointmentLocation || !formData.appointmentDate) {
      setAvailableSlots([]);
      return;
    }
    const locationSchedule = clinicHours[formData.appointmentLocation];
    const dayKey = getDayKey(formData.appointmentDate);
    if (!locationSchedule || !locationSchedule[dayKey]) {
      setAvailableSlots([]);
      return;
    }
    const [start, end] = locationSchedule[dayKey];
    setAvailableSlots(generateTimeSlots(start, end));
  }, [formData.appointmentLocation, formData.appointmentDate]);

  const isDateAvailable = (date) => {
    if (!formData.appointmentLocation) return false;
    const locationSchedule = clinicHours[formData.appointmentLocation];
    const dayKey = days[date.getDay()];
    return locationSchedule && locationSchedule[dayKey];
  };

  // Blocked by staff — location + date + time must all match
  const isBlocked = (time) => {
    return blockedSlots.some(slot =>
      slot.location === formData.appointmentLocation &&
      slot.date     === formData.appointmentDate &&
      slot.time     === time
    );
  };

  // Booked by a patient — location + date + time must all match
  const isBooked = (time) => {
    return bookedAppointments.some(appt =>
      appt.appointmentLocation === formData.appointmentLocation &&
      appt.appointmentDate     === formData.appointmentDate &&
      appt.appointmentTime     === time
    );
  };

  // A slot is unavailable if it's either blocked by staff or booked by a patient
  const isUnavailable = (time) => isBlocked(time) || isBooked(time);

  const selectTime = (time) => {
    handleChange({ target: { name: "appointmentTime", value: time } });
  };

  return (
    <div className="form-grid booking-form">

      <div className="form-group">
        <label>Preferred Appointment Location</label>
        <select
          name="appointmentLocation"
          value={formData.appointmentLocation}
          onChange={handleChange}
          className={errors.appointmentLocation ? 'error' : ''}
        >
          <option value="">Select a location</option>
          <option value="440 Boler Road">440 Boler Road</option>
          <option value="595 Bradley Avenue">595 Bradley Avenue</option>
          <option value="450 Central Avenue">450 Central Avenue</option>
          <option value="1657 Dundas Street East">1657 Dundas Street East</option>
          <option value="3209 Wonderland Road South">3209 Wonderland Road South</option>
        </select>
        {errors.appointmentLocation && <p className="error-text">{errors.appointmentLocation}</p>}
      </div>

      <div className="form-group">
        <label>Preferred Appointment Date</label>
        <Calendar
          onChange={(date) =>
            handleChange({
              target: {
                name: "appointmentDate",
                value: date.toISOString().split("T")[0]
              }
            })
          }
          tileDisabled={({ date }) => date < new Date() || !isDateAvailable(date)}
          className={errors.appointmentDate ? 'error' : ''}
        />
        {errors.appointmentDate && <p className="error-text">{errors.appointmentDate}</p>}
      </div>

      {availableSlots.length > 0 && (
        <div className="form-group full-width">
          <label>Available Time Slots</label>
          <div className={`time-slots ${errors.appointmentTime ? 'error' : ''}`}>
            {availableSlots.map((slot) => {
              const unavailable = isUnavailable(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={unavailable}
                  className={`time-slot
                    ${formData.appointmentTime === slot ? 'selected' : ''}
                    ${unavailable ? 'booked' : ''}
                  `}
                  onClick={() => !unavailable && selectTime(slot)}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          {errors.appointmentTime && <p className="error-text">{errors.appointmentTime}</p>}
        </div>
      )}

      <div className="form-group full-width">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="flexibleTiming"
            checked={formData.flexibleTiming}
            onChange={handleChange}
          />
          I am flexible with appointment timing
        </label>
      </div>

    </div>
  );
}