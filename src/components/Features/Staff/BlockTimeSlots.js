import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';

// Add this helper above the component
const formatTimeTo12Hour = (time24) => {
  const [hourStr, minute] = time24.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12.toString().padStart(2, '0')}:${minute} ${ampm}`;
};

function BlockTimeSlots() {
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [newSlot, setNewSlot] = useState({ date: '', time: '', location: '', reason: '' });

  useEffect(() => {
    fetchBlockedSlots();
  }, []);

  const fetchBlockedSlots = async () => {
    try {
      const q = query(collection(db, 'blockedSlots'), orderBy('date', 'asc'));
      const snapshot = await getDocs(q);
      setBlockedSlots(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching blocked slots:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    if (!newSlot.date || !newSlot.time || !newSlot.location) {
      setErrorMsg('Please select a date, time, and location.');
      return;
    }
    setSaving(true);
    setErrorMsg('');
    try {
      const formattedTime = formatTimeTo12Hour(newSlot.time);  // ← convert here
      const docRef = await addDoc(collection(db, 'blockedSlots'), {
        date: newSlot.date,
        time: formattedTime,                                   // ← save formatted
        location: newSlot.location,
        reason: newSlot.reason || 'Unavailable',
        blockedAt: new Date().toISOString(),
      });
      setBlockedSlots(prev => [...prev, {
        id: docRef.id,
        ...newSlot,
        time: formattedTime,                                   // ← update local state too
        reason: newSlot.reason || 'Unavailable'
      }]);
      setNewSlot({ date: '', time: '', location: '', reason: '' });
      setSuccessMsg('Time slot blocked successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error blocking slot:', err);
      setErrorMsg('Failed to block slot. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await deleteDoc(doc(db, 'blockedSlots', id));
      setBlockedSlots(prev => prev.filter(slot => slot.id !== id));
      setSuccessMsg('Time slot removed successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error removing slot:', err);
    }
  };

  return (
    <div className="staff-card">
      {successMsg && <div className="staff-alert-success">✅ {successMsg}</div>}
      {errorMsg && <div className="staff-alert-error">⚠️ {errorMsg}</div>}

      <h5 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 16 }}>
        Block a Time Slot
      </h5>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr auto', gap: 12, marginBottom: 28, alignItems: 'flex-end' }}>
        <div className="staff-form-group" style={{ margin: 0 }}>
          <label className="staff-label">Date</label>
          <input
            type="date"
            className="staff-input"
            value={newSlot.date}
            onChange={e => setNewSlot({ ...newSlot, date: e.target.value })}
          />
        </div>
        <div className="staff-form-group" style={{ margin: 0 }}>
          <label className="staff-label">Time</label>
          <input
            type="time"
            className="staff-input"
            value={newSlot.time}
            onChange={e => setNewSlot({ ...newSlot, time: e.target.value })}
          />
        </div>
        <div className="staff-form-group" style={{ margin: 0 }}>
          <label className="staff-label">Location</label>
          <select
            className="staff-input"
            value={newSlot.location}
            onChange={e => setNewSlot({ ...newSlot, location: e.target.value })}
          >
            <option value="">Select location</option>
            <option value="440 Boler Road">440 Boler Road</option>
            <option value="595 Bradley Avenue">595 Bradley Avenue</option>
            <option value="450 Central Avenue">450 Central Avenue</option>
            <option value="1657 Dundas Street East">1657 Dundas Street East</option>
            <option value="3209 Wonderland Road South">3209 Wonderland Road South</option>
          </select>
        </div>
        <div className="staff-form-group" style={{ margin: 0 }}>
          <label className="staff-label">Reason (optional)</label>
          <input
            type="text"
            className="staff-input"
            value={newSlot.reason}
            onChange={e => setNewSlot({ ...newSlot, reason: e.target.value })}
            placeholder="e.g. Staff training, Maintenance..."
          />
        </div>
        <button
          className="staff-btn"
          onClick={handleBlock}
          disabled={saving}
          style={{ height: 42 }}
        >
          {saving ? 'Blocking...' : '+ Block Slot'}
        </button>
      </div>

      <hr style={{ border: 'none', borderTop: '1.5px solid var(--border)', margin: '0 0 24px 0' }} />

      <h5 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 16 }}>
        Blocked Slots
      </h5>

      {loading ? (
        <div className="staff-loading">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : blockedSlots.length === 0 ? (
        <div className="staff-empty">
          <div className="staff-empty-icon">🔒</div>
          <h5>No blocked slots</h5>
          <p>Use the form above to block unavailable time slots.</p>
        </div>
      ) : (
        <table className="staff-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Location</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blockedSlots.map((slot) => (
              <tr key={slot.id}>
                <td>{slot.date}</td>
                <td>{slot.time}</td>
                <td>{slot.location || '—'}</td>
                <td>{slot.reason || '—'}</td>
                <td>
                  <button className="staff-btn-danger" onClick={() => handleRemove(slot.id)}>
                    Remove
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

export default BlockTimeSlots;