/**
 * Entry point for the Blood Donation Management System React app.
 * Mounts the root App component and imports global styles.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Global application styles
import './css/global.css';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
