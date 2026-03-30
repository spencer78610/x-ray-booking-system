import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';

function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const q = query(collection(db, 'appointments'), orderBy('date', 'asc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAppointments(data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

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
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td>{appt.date}</td>
              <td>{appt.time}</td>
              <td>{appt.email || appt.uid}</td>
              <td>{appt.type || '—'}</td>
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