/**
 * Navbar component — fixed top navigation bar.
 * Highlights the active route using React Router's NavLink.
 * Collapses into a hamburger menu on mobile (Bootstrap).
 */

import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  // Track scroll position to add shadow to navbar when scrolled
  const [scrolled, setScrolled] = useState(false);

  // Track mobile menu open/close state
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on nav item click
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark fixed-top custom-navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">

        {/* Brand / Logo */}
        <Link className="navbar-brand brand-logo" to="/" onClick={closeMenu}>
          <i className="fas fa-tint me-2"></i>
          <span className="brand-text">Life<span className="brand-accent">Blood</span></span>
        </Link>

        {/* Mobile hamburger toggle */}
        <button
          className={`navbar-toggler ${menuOpen ? '' : 'collapsed'}`}
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav links */}
        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">

            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-link custom-nav-link ${isActive ? 'active-link' : ''}`}
                onClick={closeMenu}
              >
                <i className="fas fa-home me-1"></i> Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/register"
                className={({ isActive }) => `nav-link custom-nav-link ${isActive ? 'active-link' : ''}`}
                onClick={closeMenu}
              >
                <i className="fas fa-user-plus me-1"></i> Register Donor
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/search"
                className={({ isActive }) => `nav-link custom-nav-link ${isActive ? 'active-link' : ''}`}
                onClick={closeMenu}
              >
                <i className="fas fa-search me-1"></i> Search Donors
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/blood-request"
                className={({ isActive }) => `nav-link custom-nav-link ${isActive ? 'active-link' : ''}`}
                onClick={closeMenu}
              >
                <i className="fas fa-hand-holding-medical me-1"></i> Blood Request
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/manage"
                className={({ isActive }) => `nav-link custom-nav-link ${isActive ? 'active-link' : ''}`}
                onClick={closeMenu}
              >
                <i className="fas fa-users-cog me-1"></i> Manage Donors
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/contact"
                className={({ isActive }) => `nav-link custom-nav-link ${isActive ? 'active-link' : ''}`}
                onClick={closeMenu}
              >
                <i className="fas fa-envelope me-1"></i> Contact
              </NavLink>
            </li>

            {/* CTA Donate Button */}
            <li className="nav-item ms-lg-2">
              <Link
                to="/register"
                className="btn btn-donate-cta"
                onClick={closeMenu}
              >
                <i className="fas fa-heart me-1"></i> Donate Now
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
