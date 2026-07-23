import './Disclaimer.css';

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Standard disclaimer note shown wherever computed results are presented.
 * @param {'inline'|'block'} variant - 'inline' for compact use inside result cards,
 * 'block' for standalone use (e.g. in the footer).
 */
function Disclaimer({ variant = 'block' }) {
  return (
    <div className={`disclaimer disclaimer--${variant}`} role="note">
      <InfoIcon />
      <p>
        <strong>Note:</strong> This is an unofficial grade computation tool developed for
        academic assistance only. The computed results are estimates and should not be
        considered as official Bicol University records or decisions.
      </p>
    </div>
  );
}

export default Disclaimer;