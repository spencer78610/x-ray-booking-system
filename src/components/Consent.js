import { useState } from "react";

export default function Consent() {
  const [formData, setFormData] = useState({
    consent: false,
    confirmInformation: false,
    privacyPolicy: false,
    cancelationPolicy: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="form-grid">
      <div className="form-group full-width">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
          />
          I consent to the collection and use of my personal information
          for the purpose of booking and managing my X-ray appointments.
        </label>
      </div>

      <div className="form-group full-width">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="confirmInformation"
            checked={formData.confirmInformation}
            onChange={handleChange}
          />
          I confirm that the information I have provided is accurate and complete.
        </label>
      </div>

      <div className="form-group full-width">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="privacyPolicy"
            checked={formData.privacyPolicy}
            onChange={handleChange}
          />
          I agree to the <a href="#">privacy policy</a>.
        </label>
      </div>

      <div className="form-group full-width">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="cancelationPolicy"
            checked={formData.cancelationPolicy}
            onChange={handleChange}
          />
          I agree to the cancellation policy.
        </label>
      </div>
    </div>
  );
}