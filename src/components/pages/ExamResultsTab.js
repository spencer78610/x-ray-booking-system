import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

function ExamResults() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [results, setResults] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
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
      } finally {
        setLoadingPatients(false);
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
    setFormData({ title: '', notes: '' });
    setSuccessMsg('');
    setErrorMsg('');
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
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'start' }}>

      {/* Left — Patient List */}
      <div className="staff-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1.5px solid var(--border)' }}>
          <input
            type="text"
            className="staff-input"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        {loadingPatients ? (
          <div className="staff-loading"><div className="spinner-border text-primary" role="status" /></div>
        ) : filteredPatients.length === 0 ? (
          <div style={{ padding: 16, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
            No patients found.
          </div>
        ) : (
          <div style={{ maxHeight: 500, overflowY: 'auto' }}>
            {filteredPatients.map(patient => (
              <div
                key={patient.id}
                onClick={() => handleSelectPatient(patient)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border)',
                  background: selectedPatient?.id === patient.id ? 'var(--primary-light)' : 'white',
                  borderLeft: selectedPatient?.id === patient.id ? '3px solid var(--primary)' : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  if (selectedPatient?.id !== patient.id)
                    e.currentTarget.style.background = 'var(--bg)';
                }}
                onMouseLeave={e => {
                  if (selectedPatient?.id !== patient.id)
                    e.currentTarget.style.background = 'white';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: selectedPatient?.id === patient.id ? 'var(--primary)' : '#e5e7eb',
                    color: selectedPatient?.id === patient.id ? 'white' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 600, fontSize: 13, flexShrink: 0,
                  }}>
                    {patient.fullName?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--text-dark)' }}>
                      {patient.fullName || 'No name'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{patient.email}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right — Form + Results */}
      <div>
        {!selectedPatient ? (
          <div className="staff-card">
            <div className="staff-empty">
              <div className="staff-empty-icon">👈</div>
              <h5>Select a patient</h5>
              <p>Choose a patient from the list to add or view exam results.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Patient header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 16, padding: '12px 16px',
              background: 'var(--primary-light)',
              border: '1.5px solid var(--accent)',
              borderRadius: 'var(--radius)',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 15,
              }}>
                {selectedPatient.fullName?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-dark)' }}>
                  {selectedPatient.fullName || 'No name'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedPatient.email}</div>
              </div>
            </div>

            {/* Add result form */}
            <div className="staff-card" style={{ marginBottom: 16 }}>
              <h5 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 14 }}>
                Add New Result
              </h5>
              {successMsg && <div className="staff-alert-success">✅ {successMsg}</div>}
              {errorMsg && <div className="staff-alert-error">⚠️ {errorMsg}</div>}
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
                  rows={3}
                  placeholder="Enter exam result details..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <button className="staff-btn" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving...' : 'Add Result'}
              </button>
            </div>

            {/* Previous results */}
            <div className="staff-card">
              <h5 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 14 }}>
                Previous Results
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {results.map(result => (
                    <div key={result.id} style={{
                      padding: '12px 14px',
                      background: 'var(--bg)',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-dark)' }}>
                          🔬 {result.title}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {new Date(result.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        {result.notes}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ExamResults;