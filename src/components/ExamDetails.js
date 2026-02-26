

export default function ExamDetails({ formData, handleChange}) {

  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Exam Type</label>
        <select name="examType" value={formData.examType} onChange={handleChange}>
          <option value="">Select exam type</option>
          <option value="x-ray">X-ray</option>
          <option value="ultrasound">Ultrasound</option>
          <option value="mammography">Mammography</option>
        </select>
      </div>

      <div className="form-group">
        <label>Specific Exam</label>
        <select name="specificExam" value={formData.specificExam} onChange={handleChange}>
          <option value="">Select specific exam</option>
          {formData.examType === 'x-ray' && (
            <>
              <option value="chest">Chest X-Ray</option>
              <option value="abdomen">Abdomen X-Ray</option>
              <option value="extremity">Extremity X-Ray</option>
            </>
          )}
          {formData.examType === 'ultrasound' && (
            <>
              <option value="abdominal">Abdominal Ultrasound</option>
              <option value="pelvic">Pelvic Ultrasound</option>
            </>
          )}
        </select>
      </div>

      <div className="form-group">
        <label>Body Part</label>
        <input type="text" name="bodyPart" value={formData.bodyPart} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Side</label>
        <select name="side" value={formData.side} onChange={handleChange}>
          <option value="">Select side</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="both">Both</option>
        </select>
      </div>

      <div className="form-group full-width">
        <label>Notes</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange} />
      </div>
    </div>
  )
}