import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({ 
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  disabled = false,
  required = false,
  icon = null,
  ...rest
}, ref) => {
  return (
    <div className="input-group" ref={ref}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          className={`input-field ${error ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        />
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
