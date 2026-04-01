import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';

const formatTimeTo12Hour = (time24) => {
  const [hourStr, minute] = time24.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12.toString().padStart(2, '0')}:${minute} ${ampm}`;
};

function StaffBooking() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: '',
    appointmentLocation: '',
    notes: '',
    status: 'Confirmed',
    // Patient info — autofilled from profile
    firstName: '',
    lastName: '',
    dob: '',
    biologicalSex: '',
    phoneNumber: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const q = query(collection(db, 'patients'), orderBy('fullName', 'asc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPatients(data.filter(p => p.role === 'patient'));
      } catch (err) {
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p =>
    p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchQuery(patient.fullName || patient.email);
    setShowDropdown(false);
    // Autofill patient info from their profile
    const nameParts = (patient.fullName || '').split(' ');
    setFormData(prev => ({
      ...prev,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      dob: patient.dob || '',
      biologicalSex: patient.gender || '',
      phoneNumber: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
    }));
  };

  const handleSubmit = async () => {
    if (!selectedPatient) { setErrorMsg('Please select a patient.'); return; }
    if (!formData.date) { setErrorMsg('Please select a date.'); return; }
    if (!formData.time) { setErrorMsg('Please select a time.'); return; }
    if (!formData.type) { setErrorMsg('Please select an exam type.'); return; }
    if (!formData.appointmentLocation) { setErrorMsg('Please select a location.'); return; }

    setSaving(true);
    setErrorMsg('');
    try {
      await addDoc(collection(db, 'appointments'), {
        uid: selectedPatient.id,
        email: formData.email,
        patientName: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
        biologicalSex: formData.biologicalSex,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        appointmentDate: formData.date,
        appointmentTime: formatTimeTo12Hour(formData.time),
        specificExam: formData.type,
        examType: formData.type,
        appointmentLocation: formData.appointmentLocation,
        notes: formData.notes,
        status: formData.status,
        bookedByStaff: true,
        createdAt: new Date().toISOString(),
      });
      setSuccessMsg(`Appointment booked for ${formData.firstName} ${formData.lastName}!`);
      setTimeout(() => setSuccessMsg(''), 4000);
      // Reset form
      setSelectedPatient(null);
      setSearchQuery('');
      setFormData({
        date: '', time: '', type: '', appointmentLocation: '', notes: '', status: 'Confirmed',
        firstName: '', lastName: '', dob: '', biologicalSex: '', phoneNumber: '', email: '', address: '',
      });
    } catch (err) {
      console.error('Error booking appointment:', err);
      setErrorMsg('Failed to book appointment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="staff-card">
      {successMsg && <div className="staff-alert-success">✅ {successMsg}</div>}
      {/* {errorMsg && <div className="staff-alert-error">⚠️ {errorMsg}</div>} */}

      <h5 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 20 }}>
        Book Appointment for Patient
      </h5>

      {/* Patient Search */}
      <div className="staff-form-group" style={{ position: 'relative' }}>
        <label className="staff-label">Search Patient</label>
        <input
          type="text"
          className="staff-input"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setSelectedPatient(null);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />
        {showDropdown && searchQuery && filteredPatients.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'white', border: '1.5px solid var(--border)',
            borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 100, maxHeight: 200, overflowY: 'auto',
          }}>
            {filteredPatients.map(patient => (
              <div
                key={patient.id}
                onClick={() => handleSelectPatient(patient)}
                style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-dark)' }}>
                  {patient.fullName || 'No name'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{patient.email}</div>
              </div>
            ))}
          </div>
        )}
        {showDropdown && searchQuery && filteredPatients.length === 0 && !loading && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'white', border: '1.5px solid var(--border)',
            borderRadius: 8, padding: '12px 14px', fontSize: 14,
            color: 'var(--text-muted)', zIndex: 100,
          }}>
            No patients found.
          </div>
        )}
      </div>

      {/* Autofilled Patient Info */}
      {selectedPatient && (
        <>
          <div style={{
            background: 'var(--primary-light)', border: '1.5px solid var(--accent)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 20,
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--primary)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, fontSize: 14, flexShrink: 0,
            }}>
              {selectedPatient.fullName?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-dark)' }}>
                {selectedPatient.fullName || 'No name'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedPatient.email}</div>
            </div>
          </div>

          {/* Autofilled fields — editable in case staff needs to correct */}
          <h6 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Patient Information
          </h6>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div className="staff-form-group">
              <label className="staff-label">First Name</label>
              <input type="text" className="staff-input" value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
            </div>
            <div className="staff-form-group">
              <label className="staff-label">Last Name</label>
              <input type="text" className="staff-input" value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
            </div>
            <div className="staff-form-group">
              <label className="staff-label">Date of Birth</label>
              <input type="date" className="staff-input" value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })} />
            </div>
            <div className="staff-form-group">
              <label className="staff-label">Biological Sex</label>
              <select className="staff-input" value={formData.biologicalSex}
                onChange={e => setFormData({ ...formData, biologicalSex: e.target.value })}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div className="staff-form-group">
              <label className="staff-label">Phone Number</label>
              <input type="tel" className="staff-input" value={formData.phoneNumber}
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} />
            </div>
            <div className="staff-form-group">
              <label className="staff-label">Email</label>
              <input type="email" className="staff-input" value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="staff-form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="staff-label">Address</label>
              <input type="text" className="staff-input" value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })} />
            </div>
          </div>
        </>
      )}

      {/* Appointment Details */}
      <h6 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Appointment Details
      </h6>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="staff-form-group">
          <label className="staff-label">Date</label>
          <input type="date" className="staff-input" value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })} />
        </div>
        <div className="staff-form-group">
          <label className="staff-label">Time</label>
          <input type="time" className="staff-input" value={formData.time}
            onChange={e => setFormData({ ...formData, time: e.target.value })} />
        </div>
        <div className="staff-form-group">
          <label className="staff-label">Exam Type</label>
          <select className="staff-input" value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}>
            <option value="">Select exam type</option>
            <option value="Chest X-Ray">Chest X-Ray</option>
            <option value="Abdomen X-Ray">Abdomen X-Ray</option>
            <option value="Extremity X-Ray">Extremity X-Ray</option>
            <option value="Abdominal Ultrasound">Abdominal Ultrasound</option>
            <option value="Pelvic Ultrasound">Pelvic Ultrasound</option>
            <option value="Mammography">Mammography</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="staff-form-group">
          <label className="staff-label">Location</label>
          <select className="staff-input" value={formData.appointmentLocation}
            onChange={e => setFormData({ ...formData, appointmentLocation: e.target.value })}>
            <option value="">Select a location</option>
            <option value="440 Boler Road">440 Boler Road</option>
            <option value="595 Bradley Avenue">595 Bradley Avenue</option>
            <option value="450 Central Avenue">450 Central Avenue</option>
            <option value="1657 Dundas Street East">1657 Dundas Street East</option>
            <option value="3209 Wonderland Road South">3209 Wonderland Road South</option>
          </select>
        </div>
        <div className="staff-form-group">
          <label className="staff-label">Status</label>
          <select className="staff-input" value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div className="staff-form-group">
          <label className="staff-label">Notes (optional)</label>
          <input type="text" className="staff-input" value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any additional notes..." />
        </div>
      </div>

      {errorMsg && <div className="staff-alert-error">⚠️ {errorMsg}</div>}

      <button className="staff-btn" onClick={handleSubmit} disabled={saving}
        style={{ marginTop: 8, padding: '10px 28px' }}>
        {saving ? 'Booking...' : 'Book Appointment'}
      </button>
    </div>
  );
}

export default StaffBooking;