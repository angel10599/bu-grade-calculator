import './StepIndicator.css';

/**
 * Horizontal step indicator for the wizard.
 * @param {Array<string>} steps - labels for each step
 * @param {number} currentStep - 1-indexed current step
 */
function StepIndicator({ steps, currentStep }) {
  return (
    <ol className="step-indicator" aria-label="Progress">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const status =
          stepNum < currentStep ? 'done' : stepNum === currentStep ? 'active' : 'upcoming';

        return (
          <li key={label} className={`step-indicator__item step-indicator__item--${status}`}>
            <span className="step-indicator__circle">
              {status === 'done' ? '✓' : stepNum}
            </span>
            <span className="step-indicator__label">{label}</span>
            {stepNum < steps.length && <span className="step-indicator__connector" />}
          </li>
        );
      })}
    </ol>
  );
}

export default StepIndicator;