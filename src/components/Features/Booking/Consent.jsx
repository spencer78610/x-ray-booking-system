import React from 'react';

export default function Consent({ formData = {}, handleChange, errors = {} }) {
  return (
    <div className="form-grid booking-form">

      <div className="form-group full-width">
        <h3>Please read and agree to the following before proceeding.</h3>
      </div>

      <div className="form-group full-width">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent || false}
            onChange={handleChange}
          />
          I consent to the collection and use of my personal and medical information for the purpose of scheduling and completing my X-ray appointment.
        </label>
        {errors.consent && <p className="error-text">{errors.consent}</p>}
      </div>

      <div className="form-group full-width">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="confirmInformation"
            checked={formData.confirmInformation || false}
            onChange={handleChange}
          />
          I confirm that all the information I have provided is accurate and complete to the best of my knowledge.
        </label>
        {errors.confirmInformation && <p className="error-text">{errors.confirmInformation}</p>}
      </div>

      <div className="form-group full-width">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="privacyPolicy"
            checked={formData.privacyPolicy || false}
            onChange={handleChange}
          />
          I have read and agree to the <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.
        </label>
        {errors.privacyPolicy && <p className="error-text">{errors.privacyPolicy}</p>}
      </div>

      <div className="form-group full-width">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="cancelationPolicy"
            checked={formData.cancelationPolicy || false}
            onChange={handleChange}
          />
          I have read and agree to the <a href="/cancellation" target="_blank" rel="noreferrer">Cancellation Policy</a>. I understand that appointments must be cancelled at least 24 hours in advance.
        </label>
        {errors.cancelationPolicy && <p className="error-text">{errors.cancelationPolicy}</p>}
      </div>

    </div>
  );
}
