/**
 * Alert component — dismissible success / error / info / warning alerts.
 *
 * Props:
 *   type     {string}  — 'success' | 'danger' | 'warning' | 'info'  (default: 'info')
 *   message  {string}  — Message text to display
 *   onClose  {func}    — Optional callback when the dismiss button is clicked
 *   show     {bool}    — Controls visibility (default: true)
 */

import React, { useEffect, useState } from 'react';
import './Alert.css';

/* Icon map per type */
const ICONS = {
  success: 'fas fa-check-circle',
  danger:  'fas fa-exclamation-circle',
  warning: 'fas fa-exclamation-triangle',
  info:    'fas fa-info-circle',
};

const Alert = ({ type = 'info', message, onClose, show = true, autoDismiss = 0 }) => {
  const [visible, setVisible] = useState(show);

  // Re-sync when the parent toggles `show`
  useEffect(() => {
    setVisible(show);
  }, [show, message]);

  // Auto-dismiss after `autoDismiss` milliseconds (0 = never)
  useEffect(() => {
    if (autoDismiss > 0 && visible) {
      const timer = setTimeout(() => handleClose(), autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [visible, autoDismiss]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible || !message) return null;

  const iconClass = ICONS[type] || ICONS.info;

  return (
    <div
      className={`custom-alert custom-alert-${type} alert-animate`}
      role="alert"
      aria-live="assertive"
    >
      <div className="alert-icon">
        <i className={iconClass}></i>
      </div>

      <div className="alert-body">
        <span className="alert-message">{message}</span>
      </div>

      {onClose && (
        <button
          type="button"
          className="alert-close-btn"
          onClick={handleClose}
          aria-label="Close alert"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

export default Alert;
