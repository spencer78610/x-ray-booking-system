import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';

function ExamResults() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({ title: '', notes: '' });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const q = query(collection(db, 'patients'), orderBy('fullName', 'asc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPatients(data.filter(p => p.role === 'patient'));
      } catch (err) {
        console.error('Error fetching patients:', err);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p =>
    p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    setSearchQuery(patient.fullName || patient.email);
    setShowDropdown(false);
    setLoadingResults(true);
    try {
      const q = query(
        collection(db, 'patients', patient.id, 'examResults'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      setResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching results:', err);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPatient) { setErrorMsg('Please select a patient.'); return; }
    if (!formData.title) { setErrorMsg('Please enter a result title.'); return; }
    if (!formData.notes) { setErrorMsg('Please enter result notes.'); return; }

    setSaving(true);
    setErrorMsg('');
    try {
      const newResult = {
        title: formData.title,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        uploadedBy: 'staff',
      };
      const docRef = await addDoc(
        collection(db, 'patients', selectedPatient.id, 'examResults'),
        newResult
      );
      setResults(prev => [{ id: docRef.id, ...newResult }, ...prev]);
      setFormData({ title: '', notes: '' });
      setSuccessMsg('Exam result added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error adding result:', err);
      setErrorMsg('Failed to add result. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="staff-card">
      {successMsg && <div className="staff-alert-success">✅ {successMsg}</div>}
      {errorMsg && <div className="staff-alert-error">⚠️ {errorMsg}</div>}

      <h5 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 20 }}>
        Add Exam Results
      </h5>

      {/* Patient Search */}
      <div className="staff-form-group" style={{ position: 'relative' }}>
        <label className="staff-label">Search Patient</label>
        <input
          type="text"
          className="staff-input"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setSelectedPatient(null); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
        />
        {showDropdown && searchQuery && filteredPatients.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1.5px solid var(--border)', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, maxHeight: 200, overflowY: 'auto' }}>
            {filteredPatients.map(patient => (
              <div key={patient.id} onClick={() => handleSelectPatient(patient)}
                style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-dark)' }}>{patient.fullName || 'No name'}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{patient.email}</div>
              </div>
            ))}
          </div>
        )}
        {showDropdown && searchQuery && filteredPatients.length === 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1.5px solid var(--border)', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: 'var(--text-muted)', zIndex: 100 }}>
            No patients found.
          </div>
        )}
      </div>

      {/* Selected patient */}
      {selectedPatient && (
        <div style={{ background: 'var(--primary-light)', border: '1.5px solid var(--accent)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14 }}>
            {selectedPatient.fullName?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-dark)' }}>{selectedPatient.fullName || 'No name'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedPatient.email}</div>
          </div>
        </div>
      )}

      {/* Form */}
      {selectedPatient && (
        <>
          <div className="staff-form-group">
            <label className="staff-label">Result Title</label>
            <input
              type="text"
              className="staff-input"
              placeholder="e.g. Chest X-Ray Results — March 2026"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="staff-form-group">
            <label className="staff-label">Result Notes</label>
            <textarea
              className="staff-input"
              rows={4}
              placeholder="Enter the exam result details here..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              style={{ resize: 'vertical' }}
            />
          </div>
          <button className="staff-btn" onClick={handleSubmit} disabled={saving} style={{ marginBottom: 28 }}>
            {saving ? 'Saving...' : 'Add Result'}
          </button>

          {/* Previous results */}
          <hr style={{ border: 'none', borderTop: '1.5px solid var(--border)', marginBottom: 20 }} />
          <h5 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 16 }}>
            Previous Results for {selectedPatient.fullName}
          </h5>
          {loadingResults ? (
            <div className="staff-loading"><div className="spinner-border text-primary" role="status" /></div>
          ) : results.length === 0 ? (
            <div className="staff-empty">
              <div className="staff-empty-icon">🔬</div>
              <h5>No results yet</h5>
              <p>Add the first exam result above.</p>
            </div>
          ) : (
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Notes</th>
                  <th>Date Added</th>
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result.id}>
                    <td style={{ fontWeight: 500 }}>{result.title}</td>
                    <td style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{result.notes}</td>
                    <td>{new Date(result.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default ExamResults;