import React, { forwardRef } from 'react';
import './Card.css';

const Card = forwardRef(({ 
  title,
  subtitle,
  children,
  headerAction = null,
  className = '',
  gradient = false,
}, ref) => {
  return (
    <div className={`card ${gradient ? 'card-gradient' : ''} ${className}`} ref={ref}>
      {(title || headerAction) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && <div className="card-header-action">{headerAction}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
});

export default Card;
