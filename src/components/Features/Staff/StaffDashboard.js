import React from 'react';
import UpcomingAppointments from './UpcomingAppointments';
import EditAppointment from './EditAppointment';
import BlockTimeSlots from './BlockTimeSlots';
import CompletedForms from './CompletedForms';

function StaffDashboard() {
  return (
    <div>
      <UpcomingAppointments />
      <EditAppointment />
      <BlockTimeSlots />
      <CompletedForms />
    </div>
  );
}

export default StaffDashboard;