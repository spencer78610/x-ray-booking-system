import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';
import AppointmentModal from './AppointmentModal';

function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filtered = data.filter(a => a.status !== 'Cancelled');

        filtered.sort((a, b) => {
          const dateA = new Date(`${a.appointmentDate} ${a.appointmentTime || '00:00'}`);
          const dateB = new Date(`${b.appointmentDate} ${b.appointmentTime || '00:00'}`);
          return dateA - dateB; // ascending (soonest first)
        });

        setAppointments(filtered);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const getDate = (a) => a.appointmentDate || a.date || '—';
  const getTime = (a) => a.appointmentTime || a.time || '—';
  const getType = (a) => a.specificExam || a.examType || a.type || '—';
  const getLocation = (a) => a.appointmentLocation || '—';
  const getPatient = (a) => {
    const fullName = `${a.firstName || ''} ${a.lastName || ''}`.trim();
    return fullName || a.patientName || a.email || a.uid || '—';
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
          <div className="staff-empty-icon">📅</div>
          <h5>No upcoming appointments</h5>
          <p>There are no appointments booked at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {selectedAppt && (
        <AppointmentModal
          appt={selectedAppt}
          onClose={() => setSelectedAppt(null)}
        />
      )}

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
              <th>Actions</th>
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
                <td>
                  <button
                    className="staff-btn"
                    onClick={() => setSelectedAppt(appt)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UpcomingAppointments;