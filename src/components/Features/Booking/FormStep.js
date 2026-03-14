import React from 'react';

export default function FormStep({ children, nextStep, prevStep, handleSubmit, stepNumber, totalSteps }) {
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

                {handleSubmit ? (
                    <button className='submit-btn' onClick={handleSubmit}>
                        Next
                    </button>
                ) : (
                    nextStep && (
                    <button className='submit-btn' onClick={nextStep}>
                        Next
                    </button>
                    )
                )}
            </div>
        </div>
    );
}