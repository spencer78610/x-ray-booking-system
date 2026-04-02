import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';

function CompletedForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showCancelled, setShowCancelled] = useState(false);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setForms(data);
      } catch (err) {
        console.error('Error fetching forms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  const getDate = (f) => f.appointmentDate || f.date || 'N/A';
  const getTime = (f) => f.appointmentTime || f.time || 'N/A';
  const getType = (f) => f.specificExam || f.examType || f.type || 'N/A';
  const getPatient = (f) => {
    const fullName = `${f.firstName || ''} ${f.lastName || ''}`.trim();
    return fullName || f.patientName || f.email || f.uid || 'N/A';
  };
  const getLocation = (f) => f.appointmentLocation || 'N/A';

  if (loading) {
    return (
      <div className="staff-card">
        <div className="staff-loading">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <div className="staff-card">
        <div className="staff-empty">
          <div className="staff-empty-icon">📋</div>
          <h5>No completed forms</h5>
          <p>Patient booking forms will appear here once submitted.</p>
        </div>
      </div>
    );
  }

  const visibleForms = showCancelled
    ? forms
    : forms.filter(f => f.status !== 'Cancelled');

  // Detail view
  if (selectedForm) {
    return (
      <div className="staff-card">
        <button
          className="staff-btn-outline"
          style={{ marginBottom: 20 }}
          onClick={() => setSelectedForm(null)}
        >
          ← Back to all forms
        </button>

        <h5 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 20 }}>
          Booking Form — {getDate(selectedForm)} at {getTime(selectedForm)}
        </h5>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Patient', value: getPatient(selectedForm) },
            { label: 'Appointment Date', value: getDate(selectedForm) },
            { label: 'Appointment Time', value: getTime(selectedForm) },
            { label: 'Exam Type', value: getType(selectedForm) },
            { label: 'Body Part', value: selectedForm.bodyPart },
            { label: 'Side', value: selectedForm.side },
            { label: 'Location', value: getLocation(selectedForm) },
            { label: 'Physician', value: selectedForm.physician },
            { label: 'Clinic', value: selectedForm.clinic },
            { label: 'Referral', value: selectedForm.referral },
            { label: 'Flexible Timing', value: selectedForm.flexibleTiming ? 'Yes' : 'No' },
            { label: 'Status', value: selectedForm.status },
            { label: 'Booked By Staff', value: selectedForm.bookedByStaff ? 'Yes' : 'No' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              padding: '12px 14px', background: 'var(--bg)',
              borderRadius: 10, border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-dark)', fontWeight: 500 }}>
                {value || <span style={{ color: 'var(--text-muted)' }}>Not provided</span>}
              </div>
            </div>
          ))}
        </div>

        {selectedForm.notes && (
          <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 4 }}>
              Notes
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-dark)' }}>{selectedForm.notes}</div>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="staff-card">

      {/* Toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button
          className={showCancelled ? 'staff-btn' : 'staff-btn-outline'}
          onClick={() => setShowCancelled(prev => !prev)}
        >
          {showCancelled ? 'Hide Cancelled' : 'Show Cancelled'}
        </button>
      </div>

      {visibleForms.length === 0 ? (
        <div className="staff-empty">
          <div className="staff-empty-icon">✅</div>
          <h5>No active forms</h5>
          <p>All submissions have been cancelled. Toggle to show them.</p>
        </div>
      ) : (
        <table className="staff-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Patient</th>
              <th>Exam Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleForms.map((form) => (
              <tr
                key={form.id}
                style={{
                  opacity: form.status === 'Cancelled' ? 0.5 : 1,
                  background: form.status === 'Cancelled' ? '#fafafa' : 'transparent',
                }}
              >
                <td>{getDate(form)}</td>
                <td>{getTime(form)}</td>
                <td>{getPatient(form)}</td>
                <td>{getType(form)}</td>
                <td>
                  <span className={`badge badge-${form.status?.toLowerCase() || 'pending'}`}>
                    {form.status || 'Pending'}
                  </span>
                </td>
                <td>
                  <button className="staff-btn" onClick={() => setSelectedForm(form)}>
                    View Form
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CompletedForms;