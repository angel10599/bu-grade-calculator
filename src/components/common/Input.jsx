import './FormField.css';

function Input({ label, id, error, hint, className = '', ...rest }) {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={id} className="form-field__label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`form-field__input ${error ? 'form-field__input--error' : ''}`}
        {...rest}
      />
      {hint && !error && <span className="form-field__hint">{hint}</span>}
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}

export default Input;