
export default function Referral({ formData, handleChange, errors }) {

  return (
    <div className="form-grid booking-form">
      {/* Referral yes/no */}
      <div className="form-group full-width">
        <label>Do you have a referral?</label>

        <div className={` radio-group ${errors.referral ? 'error' : ''}`}>
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
        {errors.referral && <p className="error-text">{errors.referral}</p>}
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
              className={errors.physician ? 'error' : ''}
              required
            />
            {errors.physician && <p className="error-text">{errors.physician}</p>}
          </div>

          <div className="form-group">
            <label>Referring Clinic Name</label>
            <input
              type="text"
              name="clinic"
              value={formData.clinic}
              onChange={handleChange}
              className={errors.clinic ? 'error' : ''}
              required
            />
            {errors.clinic && <p className="error-text">{errors.clinic}</p>}
          </div>

          <div className="form-group full-width">
            <label>Upload Referral Document</label>
            <input
              type="file"
              name="referralFile"
              accept=".pdf,.jpg,.png"
              onChange={handleChange}
              className={errors.referralFile ? 'error' : ''}
              required
            />
            {errors.referralFile && <p className="error-text">{errors.referralFile}</p>}
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