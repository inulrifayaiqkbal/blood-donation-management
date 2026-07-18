/**
 * Footer component — site-wide footer with links, info, and social icons.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">

      {/* ── Top footer ── */}
      <div className="footer-top">
        <div className="container">
          <div className="row gy-4">

            {/* Brand column */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-brand">
                <i className="fas fa-tint me-2"></i>
                <span>Life<span className="footer-accent">Blood</span></span>
              </div>
              <p className="footer-tagline">
                "Donate Blood, Save Lives."
              </p>
              <p className="footer-desc">
                Connecting blood donors with patients in need. Every drop counts —
                join our mission to save lives across the country.
              </p>
              {/* Social icons */}
              <div className="social-links">
                <a href="#!" className="social-icon" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#!" className="social-icon" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#!" className="social-icon" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="#!" className="social-icon" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>

            {/* Quick links */}
            <div className="col-lg-2 col-md-6 col-sm-6">
              <h6 className="footer-heading">Quick Links</h6>
              <ul className="footer-links">
                <li><Link to="/"><i className="fas fa-chevron-right me-1"></i>Home</Link></li>
                <li><Link to="/register"><i className="fas fa-chevron-right me-1"></i>Register Donor</Link></li>
                <li><Link to="/search"><i className="fas fa-chevron-right me-1"></i>Search Donors</Link></li>
                <li><Link to="/blood-request"><i className="fas fa-chevron-right me-1"></i>Blood Request</Link></li>
                <li><Link to="/manage"><i className="fas fa-chevron-right me-1"></i>Manage Donors</Link></li>
                <li><Link to="/contact"><i className="fas fa-chevron-right me-1"></i>Contact</Link></li>
              </ul>
            </div>

            {/* Blood groups */}
            <div className="col-lg-3 col-md-6 col-sm-6">
              <h6 className="footer-heading">Blood Groups</h6>
              <div className="blood-group-grid">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <Link to="/search" key={bg} className="blood-group-badge">
                    {bg}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <div className="col-lg-3 col-md-6">
              <h6 className="footer-heading">Contact Us</h6>
              <ul className="footer-contact">
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>123 Medical Center Drive, Health City, HC 45678</span>
                </li>
                <li>
                  <i className="fas fa-phone"></i>
                  <span>+1 (800) 555-BLOOD</span>
                </li>
                <li>
                  <i className="fas fa-envelope"></i>
                  <span>info@lifeblood.org</span>
                </li>
                <li>
                  <i className="fas fa-clock"></i>
                  <span>24/7 Emergency Support</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0">
                &copy; {currentYear} <strong>LifeBlood</strong>. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
              <p className="mb-0 footer-love">
                Made with <i className="fas fa-heart text-danger mx-1"></i> to save lives
              </p>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
