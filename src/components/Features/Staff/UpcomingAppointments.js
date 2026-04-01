import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';

function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Order by createdAt since appointmentDate and date are different fields
        const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Filter out cancelled, show upcoming only
        const upcoming = data.filter(a => a.status !== 'Cancelled');
        setAppointments(upcoming);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Helper to read either field name convention
  const getDate = (appt) => appt.appointmentDate || appt.date || '—';
  const getTime = (appt) => appt.appointmentTime || appt.time || '—';
  const getType = (appt) => appt.specificExam || appt.examType || appt.type || '—';
  const getPatient = (appt) => {
    const firstName = appt.firstName || '';
    const lastName = appt.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || appt.patientName || appt.email || appt.uid || '—';
  };
  const getLocation = (appt) => appt.appointmentLocation || '—';

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
          <div className="staff-empty-icon">📅</div>
          <h5>No upcoming appointments</h5>
          <p>There are no appointments booked at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-card">
      <table className="staff-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Patient</th>
            <th>Exam Type</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td>{getDate(appt)}</td>
              <td>{getTime(appt)}</td>
              <td>{getPatient(appt)}</td>
              <td>{getType(appt)}</td>
              <td>{getLocation(appt)}</td>
              <td>
                <span className={`badge badge-${appt.status?.toLowerCase() || 'pending'}`}>
                  {appt.status || 'Pending'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UpcomingAppointments;