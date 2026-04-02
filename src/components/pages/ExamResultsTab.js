import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

function ExamResultsTab({ user }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user?.uid) { setLoading(false); return; }
      try {
        const q = query(
          collection(db, 'patients', user.uid, 'examResults'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [user]);

  if (loading) {
    return (
      <div className="profile-card d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="profile-card text-center py-5">
        <div className="empty-icon mb-3">🔬</div>
        <h5>No exam results yet</h5>
        <p className="text-muted">Your exam results will appear here once uploaded by staff.</p>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <div className="d-flex flex-column gap-3">
        {results.map(result => (
          <div key={result.id} style={{
            padding: '16px 18px',
            background: 'var(--bg)',
            borderRadius: 10,
            border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-dark)' }}>
                🔬 {result.title}
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {new Date(result.createdAt).toLocaleDateString()}
              </span>
            </div>
            {result.notes && (
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: result.fileURL ? 10 : 0, lineHeight: 1.6 }}>
                {result.notes}
              </p>
            )}
            {result.fileURL && (
              <a
                href={result.fileURL}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'linear-gradient(135deg, #0d3d56, #0a6e8a)',
                  color: 'white',
                  padding: '7px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                  marginTop: 4,
                }}
              >
                📄 View Report
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExamResultsTab;