
export default function PatientInfo({ formData, handleChange, errors }) {

  return (
    <div className="form-grid booking-form">
      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={errors.firstName ? 'error' : ''}
        />
        {errors.firstName && <p className="error-text">{errors.firstName}</p>}
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={errors.lastName ? 'error' : ''}
        />
        {errors.lastName && <p className="error-text">{errors.lastName}</p>}
      </div>

      <div className="form-group">
        <label>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className={errors.dob ? 'error' : ''}
        />
        {errors.dob && <p className="error-text">{errors.dob}</p>}
      </div>

      {/* Biological Sex */}
      <div className="form-group">
        <label>Biological Sex</label>
        <div className={`radio-group ${errors.biologicalSex ? 'error' : ''}`}>
          <label>
            <input
              type="radio"
              name="biologicalSex"
              value="male"
              checked={formData.biologicalSex === 'male'}
              onChange={handleChange}
            />
            Male
          </label>

          <label>
            <input
              type="radio"
              name="biologicalSex"
              value="female"
              checked={formData.biologicalSex === 'female'}
              onChange={handleChange}
            />
            Female
          </label>

          <label>
            <input
              type="radio"
              name="biologicalSex"
              value="prefer_not_to_say"
              checked={formData.biologicalSex === 'prefer_not_to_say'}
              onChange={handleChange}
            />
            Prefer not to say
          </label>

        </div>
        {errors.biologicalSex && <p className="error-text">{errors.biologicalSex}</p>}
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className={errors.phoneNumber ? 'error' : ''}
        />
        {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div className="form-group full-width">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={errors.address ? 'error' : ''}
        />
        {errors.address && <p className="error-text">{errors.address}</p>}
      </div>
    </div>
  )
}

