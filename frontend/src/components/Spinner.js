/**
 * Spinner component — loading indicator displayed during API calls.
 *
 * Props:
 *   message  {string}  — Optional label shown below the spinner (default: "Loading...")
 *   fullPage {bool}    — If true, centres the spinner in the viewport
 *   size     {string}  — 'sm' | 'md' (default) | 'lg'
 */

import React from 'react';
import './Spinner.css';

const Spinner = ({ message = 'Loading...', fullPage = false, size = 'md' }) => {
  const content = (
    <div className={`spinner-wrapper spinner-${size}`}>
      {/* Animated blood drop / ring */}
      <div className="blood-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-drop">
          <i className="fas fa-tint"></i>
        </div>
      </div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="spinner-fullpage">{content}</div>;
  }

  return content;
};

export default Spinner;
