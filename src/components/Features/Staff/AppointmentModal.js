import React from 'react';

const procedureDescriptions = {
  'Chest X-Ray': {
    summary: 'A chest X-ray produces images of the heart, lungs, airways, blood vessels and the bones of the spine and chest.',
    preparation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Patients should remove jewellery and metal objects from the upper body. A lead apron may be provided to protect other areas.',
    duration: '10–15 minutes',
    aftercare: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. No special aftercare is required. Results are typically reviewed by a radiologist within 24–48 hours.',
  },
  'Abdomen X-Ray': {
    summary: 'An abdominal X-ray is used to examine the stomach, liver, intestines and other abdominal organs.',
    preparation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Patients may be asked to empty their bladder before the procedure. Remove any metal objects from the abdominal area.',
    duration: '10–20 minutes',
    aftercare: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. No special aftercare required. Normal activities can resume immediately after.',
  },
  'Extremity X-Ray': {
    summary: 'Extremity X-rays are used to examine bones and joints of the arms, legs, hands and feet for fractures or abnormalities.',
    preparation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Remove jewellery or clothing from the area being imaged. Inform the technologist of any previous injuries.',
    duration: '10–15 minutes',
    aftercare: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. No special aftercare required. Results will be sent to the referring physician.',
  },
  'Abdominal Ultrasound': {
    summary: 'An abdominal ultrasound uses sound waves to produce images of the structures within the abdomen including the liver, gallbladder, spleen, pancreas and kidneys.',
    preparation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Patients are typically asked to fast for 8–12 hours before the exam. Water is usually permitted.',
    duration: '30–45 minutes',
    aftercare: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. No special aftercare required. Normal diet and activities can resume immediately.',
  },
  'Pelvic Ultrasound': {
    summary: 'A pelvic ultrasound examines the organs and structures in the pelvic area including the uterus, ovaries, bladder and prostate.',
    preparation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. A full bladder may be required for the exam. Patients should drink several glasses of water beforehand and avoid urinating.',
    duration: '30–45 minutes',
    aftercare: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. No special aftercare required. The patient may empty their bladder immediately after.',
  },
  'Mammography': {
    summary: 'Mammography is a specific type of breast imaging that uses low-dose X-rays to detect cancer and other abnormalities early.',
    preparation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Do not apply deodorant, perfume or lotion on the day of the exam. Wear a two-piece outfit for convenience.',
    duration: '20–30 minutes',
    aftercare: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Some patients may experience minor discomfort. Results are reviewed by a radiologist and sent to the referring physician.',
  },
  'Follow-up': {
    summary: 'A follow-up imaging appointment to monitor a previously identified condition or to assess treatment progress.',
    preparation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bring any previous imaging results or referral documents. Follow any specific instructions provided by the referring physician.',
    duration: 'Varies',
    aftercare: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Follow-up instructions will be provided by the attending radiologist.',
  },
  'Other': {
    summary: 'A specialized imaging procedure as requested by the referring physician.',
    preparation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Follow any preparation instructions provided by your referring physician or our staff.',
    duration: 'Varies',
    aftercare: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aftercare instructions will be provided following the procedure.',
  },
};

const defaultDescription = {
  summary: 'Imaging procedure as requested by the referring physician.',
  preparation: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Follow any preparation instructions provided by your referring physician.',
  duration: 'Varies',
  aftercare: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aftercare instructions will be provided following the procedure.',
};

function AppointmentModal({ appt, onClose }) {
  const examKey = appt.specificExam || appt.examType || appt.type || '';
  const procedure = procedureDescriptions[examKey] || defaultDescription;

  const getDate     = (a) => a.appointmentDate     || a.date     || '—';
  const getTime     = (a) => a.appointmentTime     || a.time     || '—';
  const getType     = (a) => a.specificExam        || a.examType || a.type || '—';
  const getLocation = (a) => a.appointmentLocation || '—';
  const getPatient  = (a) => {
    const firstName = a.firstName || '';
    const lastName  = a.lastName  || '';
    const fullName  = `${firstName} ${lastName}`.trim();
    return fullName || a.patientName || a.email || a.uid || '—';
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 24,
      }}
    >
      <div style={{
        background: 'white', borderRadius: 16,
        width: '100%', maxWidth: 640,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1.5px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 4 }}>
              🩻 {getType(appt)}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {getDate(appt)} · {getTime(appt)} · {getLocation(appt)}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', fontSize: 22,
              cursor: 'pointer', color: 'var(--text-muted)',
              lineHeight: 1, padding: '0 4px',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Patient Info */}
          <section>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 12 }}>
              Patient Information
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Name',          value: getPatient(appt) },
                { label: 'Email',         value: appt.email         || '—' },
                { label: 'Phone',         value: appt.phoneNumber   || '—' },
                { label: 'Date of Birth', value: appt.dob           || '—' },
                { label: 'Sex',           value: appt.biologicalSex || '—' },
                { label: 'Address',       value: appt.address       || '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  padding: '10px 12px', background: 'var(--bg)',
                  borderRadius: 8, border: '1px solid var(--border)',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 3 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-dark)', fontWeight: 500 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Appointment Details */}
          <section>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 12 }}>
              Appointment Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Date',      value: getDate(appt) },
                { label: 'Time',      value: appt.flexibleTiming ? 'Flexible' : getTime(appt) },
                { label: 'Location',  value: getLocation(appt) },
                { label: 'Status',    value: appt.status     || '—' },
                { label: 'Referral',  value: appt.referral   || '—' },
                { label: 'Physician', value: appt.physician  || '—' },
                { label: 'Clinic',    value: appt.clinic     || '—' },
                { label: 'Body Part', value: appt.bodyPart   || '—' },
                { label: 'Side',      value: appt.side       || '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  padding: '10px 12px', background: 'var(--bg)',
                  borderRadius: 8, border: '1px solid var(--border)',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 3 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-dark)', fontWeight: 500 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
            {appt.notes && (
              <div style={{ marginTop: 10, padding: '10px 12px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 3 }}>Notes</div>
                <div style={{ fontSize: 13, color: 'var(--text-dark)' }}>{appt.notes}</div>
              </div>
            )}
          </section>

          {/* Procedure Description */}
          <section>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 12 }}>
              Procedure Information
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: '📋 Summary',     value: procedure.summary },
                { label: '⏱ Duration',     value: procedure.duration },
                { label: '📝 Preparation', value: procedure.preparation },
                { label: '💊 Aftercare',   value: procedure.aftercare },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  padding: '12px 14px', background: 'var(--primary-light)',
                  borderRadius: 8, border: '1px solid var(--accent)',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', marginBottom: 4 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-dark)', lineHeight: 1.6 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1.5px solid var(--border)',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button className="staff-btn" onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
}

export default AppointmentModal;