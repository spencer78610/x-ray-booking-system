import React, { useState } from 'react';
import UpcomingAppointments from './UpcomingAppointments';
import EditAppointment from './EditAppointment';
import BlockTimeSlots from './BlockTimeSlots';
import CompletedForms from './CompletedForms';
import './StaffStyles.css';

function StaffDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="staff-page">
      {/* Header */}
      <div className="staff-header">
        <div className="staff-header-inner">
          <div className="staff-header-left">
            <div className="staff-avatar">
              {user?.email?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <h4 className="staff-name">Staff Dashboard</h4>
              <span className="staff-email">{user?.email}</span>
            </div>
          </div>
          <button className="staff-logout-btn" onClick={onLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: 6 }}>
              <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
            Log Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="staff-container">
        <ul className="staff-tabs">
          <li>
            <button
              className={`staff-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Appointments
            </button>
          </li>
          <li>
            <button
              className={`staff-tab ${activeTab === 'edit' ? 'active' : ''}`}
              onClick={() => setActiveTab('edit')}
            >
              Edit Appointments
            </button>
          </li>
          <li>
            <button
              className={`staff-tab ${activeTab === 'block' ? 'active' : ''}`}
              onClick={() => setActiveTab('block')}
            >
              Block Time Slots
            </button>
          </li>
          <li>
            <button
              className={`staff-tab ${activeTab === 'forms' ? 'active' : ''}`}
              onClick={() => setActiveTab('forms')}
            >
              Completed Forms
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="staff-content">
          {activeTab === 'upcoming' && <UpcomingAppointments />}
          {activeTab === 'edit' && <EditAppointment />}
          {activeTab === 'block' && <BlockTimeSlots />}
          {activeTab === 'forms' && <CompletedForms />}
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;