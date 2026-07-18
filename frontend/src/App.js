/**
 * Root App component.
 * Sets up React Router DOM with all page routes.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import RegisterDonor from './pages/RegisterDonor';
import SearchDonors from './pages/SearchDonors';
import BloodRequest from './pages/BloodRequest';
import ManageDonors from './pages/ManageDonors';
import Contact from './pages/Contact';

// Global styles
import './css/global.css';

function App() {
  return (
    <Router>
      {/* Fixed top navigation bar */}
      <Navbar />

      {/* Main content area - offset for fixed navbar */}
      <main className="main-content">
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/register"       element={<RegisterDonor />} />
          <Route path="/search"         element={<SearchDonors />} />
          <Route path="/blood-request"  element={<BloodRequest />} />
          <Route path="/manage"         element={<ManageDonors />} />
          <Route path="/contact"        element={<Contact />} />

          {/* 404 fallback */}
          <Route path="*" element={
            <div className="container text-center py-5 mt-5">
              <i className="fas fa-tint fa-4x text-danger mb-4"></i>
              <h1 className="display-4 fw-bold text-danger">404</h1>
              <p className="lead text-muted">Page not found.</p>
              <a href="/" className="btn btn-danger btn-lg mt-3">
                <i className="fas fa-home me-2"></i>Go Home
              </a>
            </div>
          } />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
