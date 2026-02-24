import { useState } from 'react'

function PatientInfo() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    biologicalSex: '',
    phoneNumber: '',
    email: '',
    address: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="form-grid">
      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
      </div>

      {/* Biological Sex */}
      <div className="form-group">
        <label>Biological Sex</label>
        <div className="radio-group">
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
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-group full-width">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default PatientInfo