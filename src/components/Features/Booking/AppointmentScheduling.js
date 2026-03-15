
export default function AppointmentScheduling({ formData, handleChange }) {

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
          <option value="downtown">Downtown Clinic</option>
          <option value="uptown">Uptown Clinic</option>
          <option value="suburban">Suburban Clinic</option>
        </select>
      </div>

      <div className="form-group">
        <label>Preferred Appointment Date</label>
        <input
          type="date"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Preferred Appointment Time</label>
        <input
          type="time"
          name="appointmentTime"
          value={formData.appointmentTime}
          onChange={handleChange}
        />
      </div>

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