import { useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    biologicalSex: ''
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFormSubmission = (event) => {
    event.preventDefault()
    console.log(formData)
  }

  return (
    <form onSubmit={handleFormSubmission}>
      <label>
        First Name:
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </label>

      <label>
        Last Name:
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </label>

      <label>
        Date of Birth:
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
      </label>

      <fieldset>
        <legend>Biological Sex:</legend>

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
      </fieldset>

      <label>
        Phone Number:
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber || ''}
          onChange={handleChange}
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
        />
      </label>

      <label>
        Address:
        <input
          type="text"
          name="address"
          value={formData.address || ''}
          onChange={handleChange}
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  )
}

export default App