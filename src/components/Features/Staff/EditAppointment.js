import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

function EditAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to read either field name convention
  const getDate = (appt) => appt.appointmentDate || appt.date || '';
  const getTime = (appt) => appt.appointmentTime || appt.time || '';
  // const getType = (appt) => appt.specificExam || appt.examType || appt.type || '—';
  const getPatient = (appt) => {
    const firstName = appt.firstName || '';
    const lastName = appt.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || appt.patientName || appt.email || appt.uid || '—';
  };
   const getLocation = (appt) => appt.appointmentLocation || '';

  const handleEdit = (appt) => {
    setEditingId(appt.id);
    setEditData({
      appointmentDate: getDate(appt),
      appointmentTime: getTime(appt),
      appointmentLocation: getLocation(appt),
      status: appt.status || 'Confirmed',
    });
  };

  const handleSave = async (id) => {
    setSaving(true);
    try {
      const apptRef = doc(db, 'appointments', id);
      // Write using the correct field names and also update legacy fields
      // so staff-booked appointments stay consistent too
      await updateDoc(apptRef, {
        appointmentDate: editData.appointmentDate,
        appointmentTime: editData.appointmentTime,
        appointmentLocation: editData.appointmentLocation,
        status: editData.status,
        // Keep legacy fields in sync for staff-booked appointments
        date: editData.appointmentDate,
        time: editData.appointmentTime,
      });
      setAppointments(prev =>
        prev.map(appt => appt.id === id ? { ...appt, ...editData } : appt)
      );
      setEditingId(null);
      setSuccessMsg('Appointment updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error updating appointment:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  if (loading) {
    return (
      <div className="staff-card">
        <div className="staff-loading">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="staff-card">
        <div className="staff-empty">
          <div className="staff-empty-icon">📝</div>
          <h5>No appointments to edit</h5>
          <p>Appointments will appear here once patients book them.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-card">
      {successMsg && <div className="staff-alert-success">✅ {successMsg}</div>}
      <table className="staff-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              {editingId === appt.id ? (
                <>
                  <td>{getPatient(appt)}</td>
                  <td>
                    <input
                      type="date"
                      className="staff-input"
                      value={editData.appointmentDate}
                      onChange={e => setEditData({ ...editData, appointmentDate: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      className="staff-input"
                      value={editData.appointmentTime}
                      onChange={e => setEditData({ ...editData, appointmentTime: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="staff-input"
                      value={editData.appointmentLocation}
                      onChange={e => setEditData({ ...editData, appointmentLocation: e.target.value })}
                      placeholder="Location"
                    />
                  </td>
                  <td>
                    <select
                      className="staff-input"
                      value={editData.status}
                      onChange={e => setEditData({ ...editData, status: e.target.value })}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="staff-btn" onClick={() => handleSave(appt.id)} disabled={saving}>
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button className="staff-btn-outline" onClick={handleCancel}>
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{getPatient(appt)}</td>
                  <td>{getDate(appt)}</td>
                  <td>{getTime(appt)}</td>
                  <td>{getLocation(appt) || '—'}</td>
                  <td>
                    <span className={`badge badge-${appt.status?.toLowerCase() || 'pending'}`}>
                      {appt.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button className="staff-btn-outline" onClick={() => handleEdit(appt)}>
                      Edit
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditAppointment;