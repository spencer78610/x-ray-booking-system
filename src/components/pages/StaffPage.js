import React from 'react';
import StaffDashboard from '../Features/Staff/StaffDashboard';

function StaffPage({ user, onLogout }) {
  return (
    <div>
      <StaffDashboard user={user} onLogout={onLogout} />
    </div>
  );
}

export default StaffPage;