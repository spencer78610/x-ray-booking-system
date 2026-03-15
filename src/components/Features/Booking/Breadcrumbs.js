import React from 'react';

export default function StepBreadcrumbs({ currentStep, steps }) {
  return (
    <div className="breadcrumbs">
      {steps.map((label, index) => {
        const isActive = index + 1 === currentStep;
        return (
          <span key={index} className={isActive ? "active-step" : ""}>
            {label} {index < steps.length - 1 && "/ "}
          </span>
        );
      })}
    </div>
  )};