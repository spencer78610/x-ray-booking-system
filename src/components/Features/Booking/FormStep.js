import React from 'react';

export default function FormStep({ children, nextStep, prevStep, handleSubmit, stepNumber, totalSteps }) {
  return (
    <div className='form-step'>
      <p>Step {stepNumber} of {totalSteps}</p>

      {children}

      <div className='step-buttons'>
        {prevStep && (
          <button className='secondary-btn' type="button" onClick={prevStep}>
            Back
          </button>
        )}
        {nextStep && (
          <button className='submit-btn' type="button" onClick={nextStep}>
            Next
          </button>
        )}
        {handleSubmit && (
          <button className='submit-btn' type="button" onClick={handleSubmit}>
            Review Booking
          </button>
        )}
      </div>
    </div>
  );
}