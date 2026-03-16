// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
  });

  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  // Fetch patient profile from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "patients", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setFormData(data);
        } else {
          // Pre-fill email from Firebase Auth
          const defaults = { ...profile, email: user.email || "" };
          setProfile(defaults);
          setFormData(defaults);
        }

        // TODO: Replace with your appointments collection/query
        setAppointments([
          {
            id: 1,
            date: "2026-03-20",
            time: "10:00 AM",
            type: "Chest X-Ray",
            doctor: "Dr. Smith",
            status: "Confirmed",
          },
          {
            id: 2,
            date: "2026-03-28",
            time: "2:30 PM",
            type: "Follow-up",
            doctor: "Dr. Patel",
            status: "Pending",
          },
        ]);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "patients", user.uid);
      await updateDoc(docRef, formData);
      setProfile(formData);
      setIsEditing(false);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/home");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-4">
            <div className="d-flex align-items-center gap-3">
              <div className="profile-avatar">
                {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="mb-0 profile-name">{profile.fullName || "Patient"}</h4>
                <span className="profile-email">{user?.email}</span>
              </div>
            </div>
            <button className="btn btn-logout" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
              </svg>
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-4">
        {successMsg && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {successMsg}
          </div>
        )}

        {/* Tabs */}
        <ul className="nav profile-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Personal Info
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "appointments" ? "active" : ""}`}
              onClick={() => setActiveTab("appointments")}
            >
              Upcoming Appointments
              {appointments.length > 0 && (
                <span className="badge ms-2">{appointments.length}</span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "edit" ? "active" : ""}`}
              onClick={() => { setActiveTab("edit"); setIsEditing(true); }}
            >
              Edit Profile
            </button>
          </li>
        </ul>

        {/* Personal Info Tab */}
        {activeTab === "info" && (
          <div className="profile-card">
            <div className="row g-4">
              {[
                { label: "Full Name", value: profile.fullName, icon: "👤" },
                { label: "Email", value: profile.email, icon: "✉️" },
                { label: "Phone Number", value: profile.phone, icon: "📞" },
                { label: "Date of Birth", value: profile.dob, icon: "🎂" },
                { label: "Gender", value: profile.gender, icon: "⚧" },
                { label: "Address", value: profile.address, icon: "📍" },
              ].map(({ label, value, icon }) => (
                <div className="col-md-6" key={label}>
                  <div className="info-field">
                    <span className="info-icon">{icon}</span>
                    <div>
                      <div className="info-label">{label}</div>
                      <div className="info-value">{value || <span className="text-muted">Not provided</span>}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button className="btn btn-primary-custom" onClick={() => { setActiveTab("edit"); setIsEditing(true); }}>
                Edit Profile
              </button>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="profile-card">
            {appointments.length === 0 ? (
              <div className="text-center py-5">
                <div className="empty-icon mb-3">📅</div>
                <h5>No upcoming appointments</h5>
                <p className="text-muted">You have no scheduled appointments at this time.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {appointments.map((appt) => (
                  <div className="appointment-card" key={appt.id}>
                    <div className="appt-date-block">
                      <div className="appt-month">
                        {new Date(appt.date).toLocaleString("default", { month: "short" })}
                      </div>
                      <div className="appt-day">
                        {new Date(appt.date).getDate()}
                      </div>
                    </div>
                    <div className="appt-details">
                      <div className="appt-type">{appt.type}</div>
                      <div className="appt-meta">
                        {appt.doctor} · {appt.time}
                      </div>
                    </div>
                    <span className={`appt-status ${appt.status.toLowerCase()}`}>
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Edit Profile Tab */}
        {activeTab === "edit" && (
          <div className="profile-card">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control custom-input"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control custom-input"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control custom-input"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control custom-input"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <select
                  className="form-select custom-input"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control custom-input"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                />
              </div>
            </div>
            <div className="d-flex gap-3 mt-4">
              <button className="btn btn-primary-custom" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Saving...
                  </>
                ) : "Save Changes"}
              </button>
              <button className="btn btn-outline-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;