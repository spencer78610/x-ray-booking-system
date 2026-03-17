import React from 'react';
import { useState, useEffect } from 'react';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function AppointmentScheduling({ formData, handleChange }) {

  const clinicHours = {
    "440 Boler Road": {
      mon: ["07:00", "21:00"],
      tue: ["07:00", "21:00"],
      wed: ["07:00", "21:00"],
      thu: ["07:00", "21:00"],
      fri: ["08:00", "16:00"]
    },

    "595 Bradley Avenue": {
      mon: ["07:00", "21:00"],
      tue: ["07:00", "21:00"],
      wed: ["07:00", "21:00"],
      thu: ["07:00", "21:00"],
      fri: ["08:00", "16:00"],
      sat: ["08:00", "15:00"]
    },

    "450 Central Avenue": {
      mon: ["08:00", "16:00"],
      tue: ["08:00", "16:00"],
      wed: ["08:00", "16:00"],
      thu: ["08:00", "16:00"],
      fri: ["08:00", "16:00"]
    },

    "1657 Dundas Street East": {
      mon: ["08:00", "16:00"],
      tue: ["08:00", "16:00"],
      wed: ["08:00", "16:00"],
      thu: ["08:00", "16:00"],
      fri: ["08:00", "16:00"]
    },

    "3209 Wonderland Road South": {
      mon: ["08:00", "16:00"],
      tue: ["08:00", "16:00"],
      wed: ["08:00", "16:00"],
      thu: ["08:00", "16:00"],
      fri: ["08:00", "16:00"]
    }
  };

  const bookedSlots = ["09:00 AM", "09:30 AM"]; // Example of booked slots for demonstration
  const isBooked = (time) => bookedSlots.includes(time);
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const getDayKey = (dateString) => {
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    return days[date.getDay()];
  };

  const isDateAvailable = (date) => {
    if (!formData.appointmentLocation) return false;

    const locationSchedule = clinicHours[formData.appointmentLocation];
    const dayKey = days[date.getDay()];

    return locationSchedule && locationSchedule[dayKey];
  };

  const generateTimeSlots = (start, end) => {
    const slots = [];

    let current = new Date(`1970-01-01T${start}:00`);
    const finish = new Date(`1970-01-01T${end}:00`);

    while (current < finish) {
      slots.push(
        current.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );

      current.setMinutes(current.getMinutes() + 30);
    }

    return slots;
  };

  const [availableSlots, setAvailableSlots] = useState([]);

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
    const slots = generateTimeSlots(start, end);

    setAvailableSlots(slots);

  }, [formData.appointmentLocation, formData.appointmentDate]);

  const selectTime = (time) => {
    handleChange({
      target: {
        name: "appointmentTime",
        value: time
      }
    });
  };

  return (
    <div className="form-grid booking-form">

      <div className="form-group">
        <label>Preferred Appointment Location</label>
        <select
          name="appointmentLocation"
          value={formData.appointmentLocation}
          onChange={handleChange}
        >
          <option value="">Select a location</option>
          <option value="440 Boler Road">440 Boler Road</option>
          <option value="595 Bradley Avenue">595 Bradley Avenue</option>
          <option value="450 Central Avenue">450 Central Avenue</option>
          <option value="1657 Dundas Street East">1657 Dundas Street East</option>
          <option value="3209 Wonderland Road South">3209 Wonderland Road South</option>
        </select>
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
          tileDisabled={({ date }) =>
            date < new Date() || !isDateAvailable(date)
          }
        />
      </div>

      {availableSlots.length > 0 && (
        <div className="form-group full-width">
          <label>Available Time Slots</label>

          <div className="time-slots">

            {availableSlots.map((slot) => {

              const booked = isBooked(slot);

              return (
                <button
                  key={slot}
                  type="button"
                  disabled={booked}
                  className={`time-slot
                  ${formData.appointmentTime === slot ? "selected" : ""}
                  ${booked ? "booked" : ""}
                `}
                  onClick={() => selectTime(slot)}
                >
                  {slot}
                </button>
              );
            })}

          </div>

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