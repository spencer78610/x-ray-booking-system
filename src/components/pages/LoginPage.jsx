import React, { useState } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@500&display=swap');

  .login-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #f0f4f8;
  }

  .login-panel {
    width: 45%;
    background: linear-gradient(160deg, #0d3d56 0%, #0a6e8a 60%, #0fa3b1 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 18px;
    position: relative;
    overflow: hidden;
  }

  .login-panel::before {
    content: '';
    position: absolute;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    border: 60px solid rgba(255,255,255,0.06);
    top: -100px;
    right: -100px;
  }

  .login-panel::after {
    content: '';
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    border: 40px solid rgba(255,255,255,0.05);
    bottom: 60px;
    left: -60px;
  }

  .panel-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 1;
  }

  .panel-logo-icon {
    width: 40px;
    height: 40px;
    background: rgba(255,255,255,0.15);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .panel-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: white;
    letter-spacing: 0.3px;
  }

  .panel-body { z-index: 1; }

  .panel-heading {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    color: white;
    line-height: 1.25;
    margin-bottom: 16px;
  }

  .panel-sub {
    color: rgba(255,255,255,0.65);
    font-size: 15px;
    line-height: 1.6;
    max-width: 300px;
  }

  .panel-badges {
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 1;
  }

  .panel-badge {
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(255,255,255,0.8);
    font-size: 13px;
  }

  .badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #0fa3b1;
    flex-shrink: 0;
  }

  .login-form-side {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
  }

  .login-card-title {
    font-size: 26px;
    font-weight: 600;
    color: #0d3d56;
    margin-bottom: 6px;
  }

  .login-card-sub {
    font-size: 14px;
    color: #6b7e8d;
    margin-bottom: 32px;
  }

  .role-toggle {
    display: flex;
    background: #e2eaf0;
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 28px;
    position: relative;
  }

  .role-toggle-btn {
    flex: 1;
    padding: 10px;
    border: none;
    background: transparent;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #6b7e8d;
    cursor: pointer;
    transition: color 0.2s;
    position: relative;
    z-index: 1;
  }

  .role-toggle-btn.active { color: #0d3d56; }

  .role-toggle-slider {
    position: absolute;
    top: 4px;
    bottom: 4px;
    width: calc(50% - 4px);
    background: white;
    border-radius: 7px;
    box-shadow: 0 1px 4px rgba(13,61,86,0.12);
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
  }

  .role-toggle-slider.staff { transform: translateX(calc(100% + 8px)); }

  .form-group { margin-bottom: 18px; }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #3d5a6e;
    margin-bottom: 6px;
  }

  .form-input-wrap { position: relative; }

  .form-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #8aa0b0;
    font-size: 16px;
    pointer-events: none;
  }

  .form-input {
    width: 100%;
    padding: 11px 14px 11px 40px;
    border: 1.5px solid #d0dde6;
    border-radius: 9px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #0d3d56;
    background: white;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .form-input:focus {
    border-color: #0a6e8a;
    box-shadow: 0 0 0 3px rgba(10,110,138,0.1);
  }

  .form-input::placeholder { color: #aabbc7; }

  .form-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .form-remember {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    color: #6b7e8d;
    cursor: pointer;
  }

  .form-remember input[type="checkbox"] {
    accent-color: #0a6e8a;
    width: 15px;
    height: 15px;
  }

  .form-forgot {
    font-size: 13px;
    color: #0a6e8a;
    text-decoration: none;
    font-weight: 500;
  }

  .form-forgot:hover { text-decoration: underline; }

  .login-btn {
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, #0d3d56, #0a6e8a);
    color: white;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
    letter-spacing: 0.2px;
  }

  .login-btn:hover { opacity: 0.92; }
  .login-btn:active { transform: scale(0.99); }
  .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .login-error {
    background: #fff0f0;
    border: 1px solid #f5c6c6;
    color: #c0392b;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 16px;
  }

  .login-success {
    background: #f0faf4;
    border: 1px solid #a8ddb8;
    color: #1e7e42;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 16px;
  }

  .login-divider {
    text-align: center;
    font-size: 13px;
    color: #9bb0be;
    margin: 20px 0 0;
  }

  @media (max-width: 768px) {
    .login-root { flex-direction: column; }
    .login-panel { width: 100%; min-height: 200px; padding: 32px; }
    .panel-body .panel-heading { font-size: 26px; }
    .panel-badges { display: none; }
    .login-form-side { padding: 32px 24px; }
  }
`;

export default function LoginPage({ onLogin, onGoToRegister }) {
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  if (!email || !password) {
    setError('Please fill in all fields.');
    return;
  }

  setLoading(true);

  try {
    // Set persistence based on remember me checkbox
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);

    // Sign in with Firebase Auth
    const result = await signInWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;

    // Fetch real role from Firestore
    const docRef = doc(db, "patients", uid);
    const docSnap = await getDoc(docRef);
    const userData = docSnap.exists() ? docSnap.data() : {};
    const realRole = userData.role || role;

    // Verify role matches what user selected
    if (realRole !== role) {
      setError(`This account is not registered as a ${role}. Please select the correct role.`);
      setLoading(false);
      return;
    }

    setSuccess(`Logged in as ${realRole === 'patient' ? 'Patient' : 'Staff Member'}.`);
    if (onLogin) onLogin({ email, role: realRole, uid });

  } catch (err) {
    switch (err.code) {
      case 'auth/user-not-found':
        setError('No account found with this email.');
        break;
      case 'auth/wrong-password':
        setError('Incorrect password. Please try again.');
        break;
      case 'auth/invalid-email':
        setError('Please enter a valid email address.');
        break;
      case 'auth/too-many-requests':
        setError('Too many failed attempts. Please try again later.');
        break;
      default:
        setError('Login failed. Please check your credentials.');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-panel">
          <div className="panel-logo">
            <div className="panel-logo-icon">🩻</div>
            <span className="panel-logo-text">London X-Ray</span>
          </div>
          <div className="panel-body">
            <h1 className="panel-heading">Your health,<br />your access.</h1>
            <p className="panel-sub">Securely manage appointments, results, and records — all in one place.</p>
          </div>
          <div className="panel-badges">
            <div className="panel-badge"><span className="badge-dot" />View and book appointments</div>
            <div className="panel-badge"><span className="badge-dot" />Access imaging results</div>
            <div className="panel-badge"><span className="badge-dot" />Staff dashboard & scheduling</div>
          </div>
        </div>

        <div className="login-form-side">
          <div className="login-card">

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
              <button
                type="button"
                onClick={onGoToRegister}
                style={{
                  background: "transparent",
                  border: "1.5px solid #0a6e8a",
                  color: "#0a6e8a",
                  borderRadius: "8px",
                  padding: "7px 16px",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Create Account
              </button>
            </div>

            <h2 className="login-card-title">Welcome back</h2>
            <p className="login-card-sub">Sign in to continue to your portal</p>

            <div className="role-toggle">
              <div className={`role-toggle-slider ${role === 'staff' ? 'staff' : ''}`} />
              <button
                type="button"
                className={`role-toggle-btn ${role === 'patient' ? 'active' : ''}`}
                onClick={() => { setRole('patient'); setError(''); setSuccess(''); }}
              >
                🧑‍⚕️ Patient
              </button>
              <button
                type="button"
                className={`role-toggle-btn ${role === 'staff' ? 'active' : ''}`}
                onClick={() => { setRole('staff'); setError(''); setSuccess(''); }}
              >
                👨‍💼 Staff
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <div className="login-error">⚠️ {error}</div>}
              {success && <div className="login-success">✅ {success}</div>}

              <div className="form-group">
                <label className="form-label">Email address</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon"> ✉</span>
                  <input
                    className="form-input"
                    type="email"
                    placeholder={role === 'patient' ? 'patient@email.com' : 'staff@hospital.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="form-input-wrap">
                  <span className="form-input-icon">🔒</span>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="form-remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
                <a href="/forgot-password" className="form-forgot">Forgot password?</a>
              </div>

              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : `Sign in as ${role === 'patient' ? 'Patient' : 'Staff'}`}
              </button>
            </form>

            <p className="login-divider">
              {role === 'patient'
                ? 'New patient? Click "Create Account" to register.'
                : 'Staff access issues? Contact your IT administrator.'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}