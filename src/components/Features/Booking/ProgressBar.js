import { useEffect, useState } from "react";

const ProgressBar = ({ currentStep, totalSteps }) => {
  const [width, setWidth] = useState(0); // Start at 0

  const progressPercent = (currentStep / totalSteps) * 100;

  useEffect(() => {
    // Delay setting the width to trigger transition
    const timer = setTimeout(() => {
      setWidth(progressPercent);
    }, 50); // 50ms delay
    return () => clearTimeout(timer);
  }, [progressPercent]);

  return (
    <div className="progress-container">
      <div
        className="progress-bar"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default ProgressBar;