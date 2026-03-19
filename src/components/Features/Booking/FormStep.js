import React from 'react';

export default function FormStep({ children, nextStep, prevStep, stepNumber, totalSteps }) {
  return (
    <div className='form-step'>
      <p>Step {stepNumber} of {totalSteps}</p>

      {children}

      <div className='step-buttons'>
        {prevStep && (
          <button className='secondary-btn' onClick={prevStep}>
            Back
          </button>
        )}

        {nextStep && (
          <button className='submit-btn' onClick={nextStep}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}