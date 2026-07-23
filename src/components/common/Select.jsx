import './FormField.css';

function Select({ label, id, error, hint, className = '', children, ...rest }) {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={id} className="form-field__label">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`form-field__input form-field__select ${error ? 'form-field__input--error' : ''}`}
        {...rest}
      >
        {children}
      </select>
      {hint && !error && <span className="form-field__hint">{hint}</span>}
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}

export default Select;