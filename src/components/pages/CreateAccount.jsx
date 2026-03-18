import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@500&display=swap');

  .ca-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #f0f4f8;
  }

  .ca-panel {
    width: 45%;
    background: linear-gradient(160deg, #0d3d56 0%, #0a6e8a 60%, #0fa3b1 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px;
    position: relative;
    overflow: hidden;
  }

  .ca-panel::before {
    content: '';
    position: absolute;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    border: 60px solid rgba(255,255,255,0.06);
    top: -100px;
    right: -100px;
  }

  .ca-panel::after {
    content: '';
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    border: 40px solid rgba(255,255,255,0.05);
    bottom: 60px;
    left: -60px;
  }

  .ca-panel-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 1;
  }

  .ca-panel-logo-icon {
    width: 40px;
    height: 40px;
    background: rgba(255,255,255,0.15);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .ca-panel-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: white;
    letter-spacing: 0.3px;
  }

  .ca-panel-body { z-index: 1; }

  .ca-panel-heading {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    color: white;
    line-height: 1.25;
    margin-bottom: 16px;
  }

  .ca-panel-sub {
    color: rgba(255,255,255,0.65);
    font-size: 15px;
    line-height: 1.6;
    max-width: 300px;
  }

  .ca-panel-steps {
    display: flex;
    flex-direction: column;
    gap: 16px;
    z-index: 1;
  }

  .ca-step {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .ca-step-num {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    color: white;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ca-step-text {
    color: rgba(255,255,255,0.8);
    font-size: 13px;
  }

  .ca-form-side {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    overflow-y: auto;
  }

  .ca-card {
    width: 100%;
    max-width: 440px;
  }

  .ca-card-title {
    font-size: 26px;
    font-weight: 600;
    color: #0d3d56;
    margin-bottom: 6px;
  }

  .ca-card-sub {
    font-size: 14px;
    color: #6b7e8d;
    margin-bottom: 28px;
  }

  .ca-role-toggle {
    display: flex;
    background: #e2eaf0;
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 24px;
    position: relative;
  }

  .ca-role-btn {
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

  .ca-role-btn.active { color: #0d3d56; }

  .ca-role-slider {
    position: absolute;
    top: 4px;
    bottom: 4px;
    width: calc(50% - 4px);
    background: white;
    border-radius: 7px;
    box-shadow: 0 1px 4px rgba(13,61,86,0.12);
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
  }

  .ca-role-slider.staff { transform: translateX(calc(100% + 8px)); }

  .ca-row { display: flex; gap: 12px; }
  .ca-row .ca-group { flex: 1; }
  .ca-group { margin-bottom: 16px; }

  .ca-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #3d5a6e;
    margin-bottom: 6px;
  }

  .ca-input-wrap { position: relative; }

  .ca-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #8aa0b0;
    font-size: 15px;
    pointer-events: none;
  }

  .ca-input {
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

  .ca-input:focus {
    border-color: #0a6e8a;
    box-shadow: 0 0 0 3px rgba(10,110,138,0.1);
  }

  .ca-input::placeholder { color: #aabbc7; }
  .ca-input.error { border-color: #e74c3c; }
  .ca-field-error { font-size: 11px; color: #e74c3c; margin-top: 4px; }

  .ca-staff-field {
    background: #f7fafc;
    border: 1.5px dashed #b0c8d6;
    border-radius: 9px;
    padding: 12px 14px 12px 40px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #0d3d56;
    width: 100%;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }

  .ca-staff-field:focus {
    border-color: #0a6e8a;
    border-style: solid;
    box-shadow: 0 0 0 3px rgba(10,110,138,0.1);
  }

  .ca-staff-field::placeholder { color: #aabbc7; }

  .ca-strength-bar { display: flex; gap: 4px; margin-top: 8px; }

  .ca-strength-seg {
    height: 3px;
    flex: 1;
    border-radius: 2px;
    background: #e2eaf0;
    transition: background 0.3s;
  }

  .ca-strength-seg.weak { background: #e74c3c; }
  .ca-strength-seg.fair { background: #f39c12; }
  .ca-strength-seg.good { background: #2ecc71; }
  .ca-strength-seg.strong { background: #0a6e8a; }
  .ca-strength-label { font-size: 11px; color: #8aa0b0; margin-top: 4px; }

  .ca-terms {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    color: #6b7e8d;
    margin: 16px 0 20px;
    cursor: pointer;
    line-height: 1.5;
  }

  .ca-terms input[type="checkbox"] {
    accent-color: #0a6e8a;
    width: 15px;
    height: 15px;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .ca-terms a { color: #0a6e8a; text-decoration: none; }
  .ca-terms a:hover { text-decoration: underline; }

  .ca-btn {
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

  .ca-btn:hover { opacity: 0.92; }
  .ca-btn:active { transform: scale(0.99); }
  .ca-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .ca-error {
    background: #fff0f0;
    border: 1px solid #f5c6c6;
    color: #c0392b;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 16px;
  }

  .ca-success {
    background: #f0faf4;
    border: 1px solid #a8ddb8;
    color: #1e7e42;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 16px;
  }

  
  .ca-login-link {
    text-align: center;
    font-size: 13px;
    color: #6b7e8d;
    margin-top: 20px;
  }

  .ca-login-link a { color: #0a6e8a; font-weight: 500; text-decoration: none; }
  .ca-login-link a:hover { text-decoration: underline; }

  @media (max-width: 768px) {
    .ca-root { flex-direction: column; }
    .ca-panel { width: 100%; min-height: 200px; padding: 32px; }
    .ca-panel-heading { font-size: 26px; }
    .ca-panel-steps { display: none; }
    .ca-form-side { padding: 32px 24px; }
    .ca-row { flex-direction: column; gap: 0; }
  }
`;

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const classes = ['', 'weak', 'fair', 'good', 'strong'];
  return { score, label: labels[score], cls: classes[score] };
}

export default function CreateAccountPage({ onAccountCreated, onGoToLogin }) {
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', password: '', confirmPassword: '',
    staffId: '', department: ''
  });
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  const strength = getPasswordStrength(form.password);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (role === 'staff' && !form.staffId.trim()) e.staffId = 'Staff ID is required';
    if (!agreed) e.agreed = 'You must agree to the terms';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }

    setLoading(true);
    try {
      // Create user in Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = result.user.uid;

      // Save user data to Firestore
      await setDoc(doc(db, 'patients', uid), {
        fullName: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone || '',
        dob: '',
        gender: '',
        address: '',
        role,
        ...(role === 'staff' && { staffId: form.staffId, department: form.department }),
        createdAt: new Date().toISOString(),
      });

      setSuccess(`Account created! Welcome, ${form.firstName}.`);
      if (onAccountCreated) onAccountCreated({ email: form.email, role, uid });
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setSubmitError('An account with this email already exists.');
          break;
        case 'auth/invalid-email':
          setSubmitError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setSubmitError('Password is too weak. Please use a stronger password.');
          break;
        default:
          setSubmitError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ca-root">
        <div className="ca-panel">
          <div className="ca-panel-logo">
            <div className="ca-panel-logo-icon">🩻</div>
            <span className="ca-panel-logo-text">London X-ray</span>
          </div>
          <div className="ca-panel-body">
            <h1 className="ca-panel-heading">Get started<br />in minutes.</h1>
            <p className="ca-panel-sub">Create your account and get instant access to appointments, results, and more.</p>
          </div>
          <div className="ca-panel-steps">
            <div className="ca-step"><div className="ca-step-num">1</div><span className="ca-step-text">Fill in your personal details</span></div>
            <div className="ca-step"><div className="ca-step-num">2</div><span className="ca-step-text">Choose your role — patient or staff</span></div>
            <div className="ca-step"><div className="ca-step-num">3</div><span className="ca-step-text">Sign in and access your portal</span></div>
          </div>
        </div>

        <div className="ca-form-side">
          <div className="ca-card">
            <h2 className="ca-card-title">Create an account</h2>
            <p className="ca-card-sub">Register as a patient or staff member</p>

            <div className="ca-role-toggle">
              <div className={`ca-role-slider ${role === 'staff' ? 'staff' : ''}`} />
              <button type="button" className={`ca-role-btn ${role === 'patient' ? 'active' : ''}`}
                onClick={() => { setRole('patient'); setErrors({}); }}>🧑‍⚕️ Patient</button>
              <button type="button" className={`ca-role-btn ${role === 'staff' ? 'active' : ''}`}
                onClick={() => { setRole('staff'); setErrors({}); }}>👨‍💼 Staff</button>
            </div>

            <form onSubmit={handleSubmit}>
              {submitError && <div className="ca-error">⚠️ {submitError}</div>}
              {success && <div className="ca-success">✅ {success}</div>}

              <div className="ca-row">
                <div className="ca-group">
                  <label className="ca-label">First name</label>
                  <div className="ca-input-wrap">
                    <span className="ca-input-icon">👤</span>
                    <input className={`ca-input ${errors.firstName ? 'error' : ''}`} type="text" placeholder="Jane"
                      value={form.firstName} onChange={e => update('firstName', e.target.value)} />
                  </div>
                  {errors.firstName && <div className="ca-field-error">{errors.firstName}</div>}
                </div>
                <div className="ca-group">
                  <label className="ca-label">Last name</label>
                  <div className="ca-input-wrap">
                    <span className="ca-input-icon">👤</span>
                    <input className={`ca-input ${errors.lastName ? 'error' : ''}`} type="text" placeholder="Doe"
                      value={form.lastName} onChange={e => update('lastName', e.target.value)} />
                  </div>
                  {errors.lastName && <div className="ca-field-error">{errors.lastName}</div>}
                </div>
              </div>

              <div className="ca-group">
                <label className="ca-label">Email address</label>
                <div className="ca-input-wrap">
                  <span className="ca-input-icon">✉</span>
                  <input className={`ca-input ${errors.email ? 'error' : ''}`} type="email" placeholder="jane@email.com"
                    value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
                {errors.email && <div className="ca-field-error">{errors.email}</div>}
              </div>

              <div className="ca-group">
                <label className="ca-label">Phone number</label>
                <div className="ca-input-wrap">
                  <span className="ca-input-icon">📞</span>
                  <input className="ca-input" type="tel" placeholder="+44 7700 000000"
                    value={form.phone} onChange={e => update('phone', e.target.value)} />
                </div>
              </div>

              {role === 'staff' && (
                <>
                  <div className="ca-group">
                    <label className="ca-label">Staff ID</label>
                    <div className="ca-input-wrap">
                      <span className="ca-input-icon">🪪</span>
                      <input className={`ca-staff-field ${errors.staffId ? 'error' : ''}`} type="text" placeholder="e.g. STF-00123"
                        value={form.staffId} onChange={e => update('staffId', e.target.value)} />
                    </div>
                    {errors.staffId && <div className="ca-field-error">{errors.staffId}</div>}
                  </div>
                  <div className="ca-group">
                    <label className="ca-label">Department</label>
                    <div className="ca-input-wrap">
                      <span className="ca-input-icon">🏥</span>
                      <input className="ca-input" type="text" placeholder="e.g. Radiology"
                        value={form.department} onChange={e => update('department', e.target.value)} />
                    </div>
                  </div>
                </>
              )}

              <div className="ca-group">
                <label className="ca-label">Password</label>
                <div className="ca-input-wrap">
                  <span className="ca-input-icon">🔒</span>
                  <input className={`ca-input ${errors.password ? 'error' : ''}`} type="password" placeholder="Min. 8 characters"
                    value={form.password} onChange={e => update('password', e.target.value)} />
                </div>
                {form.password && (
                  <>
                    <div className="ca-strength-bar">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`ca-strength-seg ${i <= strength.score ? strength.cls : ''}`} />
                      ))}
                    </div>
                    <div className="ca-strength-label">{strength.label}</div>
                  </>
                )}
                {errors.password && <div className="ca-field-error">{errors.password}</div>}
              </div>

              <div className="ca-group">
                <label className="ca-label">Confirm password</label>
                <div className="ca-input-wrap">
                  <span className="ca-input-icon">🔒</span>
                  <input className={`ca-input ${errors.confirmPassword ? 'error' : ''}`} type="password" placeholder="Re-enter your password"
                    value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
                </div>
                {errors.confirmPassword && <div className="ca-field-error">{errors.confirmPassword}</div>}
              </div>

              <label className="ca-terms">
                <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors(prev => ({ ...prev, agreed: '' })); }} />
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
              </label>
              {errors.agreed && <div className="ca-field-error" style={{marginTop: '-12px', marginBottom: '12px'}}>{errors.agreed}</div>}

              <button className="ca-btn" type="submit" disabled={loading}>
                {loading ? 'Creating account…' : `Create ${role === 'patient' ? 'Patient' : 'Staff'} Account`}
              </button>
            </form>

            <p className="ca-login-link">
              Already have an account? <a href="/login" onClick={e => { e.preventDefault(); if (onGoToLogin) onGoToLogin(); }}>Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}