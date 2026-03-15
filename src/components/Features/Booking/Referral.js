
export default function Referral({ formData, handleChange }) {

  return (
    <div className="form-grid booking-form">
      {/* Referral yes/no */}
      <div className="form-group full-width">
        <label>Do you have a referral?</label>

        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="referral"
              value="yes"
              checked={formData.referral === "yes"}
              onChange={handleChange}
            />
            Yes
          </label>

          <label>
            <input
              type="radio"
              name="referral"
              value="no"
              checked={formData.referral === "no"}
              onChange={handleChange}
            />
            No
          </label>
        </div>
      </div>

      {/* Conditional fields */}
      {formData.referral === "yes" && (
        <>
          <div className="form-group">
            <label>Referring Physician Name</label>
            <input
              type="text"
              name="physician"
              value={formData.physician}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Referring Clinic Name</label>
            <input
              type="text"
              name="clinic"
              value={formData.clinic}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Upload Referral Document</label>
            <input
              type="file"
              name="referralFile"
              accept=".pdf,.jpg,.png"
              onChange={handleChange}
              required
            />
          </div>
        </>
      )}

      {formData.referral === "no" && (
        <div className="form-group full-width">
          <p className="form-warning">
            A referral is required before your appointment can be booked.
          </p>
        </div>
      )}
    </div>
  );
}