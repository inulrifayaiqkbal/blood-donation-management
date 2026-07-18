/**
 * RegisterDonor page — form to register a new blood donor.
 *
 * Features:
 *  - Full form validation (client-side)
 *  - Axios POST to /api/donors/ via api service
 *  - Loading spinner during submission
 *  - Success / error alert feedback
 *  - Reset form on success
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createDonor } from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import './RegisterDonor.css';

/* ── Dropdown options ── */
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS      = ['Male', 'Female', 'Other'];

/* ── Initial empty form state ── */
const INITIAL_FORM = {
  name:        '',
  age:         '',
  gender:      '',
  blood_group: '',
  phone:       '',
  email:       '',
  address:     '',
  city:        '',
};

/* ── Validate a single field ── */
const validateField = (name, value) => {
  switch (name) {
    case 'name':
      if (!value.trim()) return 'Full name is required.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    case 'age':
      if (!value) return 'Age is required.';
      if (isNaN(value) || value < 18 || value > 65)
        return 'Age must be between 18 and 65.';
      return '';
    case 'gender':
      return value ? '' : 'Please select a gender.';
    case 'blood_group':
      return value ? '' : 'Please select a blood group.';
    case 'phone':
      if (!value.trim()) return 'Phone number is required.';
      if (!/^[+\d\s\-()]{7,20}$/.test(value.trim()))
        return 'Enter a valid phone number.';
      return '';
    case 'email':
      if (!value.trim()) return 'Email address is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
        return 'Enter a valid email address.';
      return '';
    case 'address':
      if (!value.trim()) return 'Address is required.';
      if (value.trim().length < 5) return 'Please enter a complete address.';
      return '';
    case 'city':
      if (!value.trim()) return 'City is required.';
      if (value.trim().length < 2) return 'Please enter a valid city name.';
      return '';
    default:
      return '';
  }
};

/* ══════════════════════════════════════
   REGISTER DONOR COMPONENT
   ══════════════════════════════════════ */
const RegisterDonor = () => {
  const [form,    setForm]    = useState(INITIAL_FORM);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [alert,   setAlert]   = useState({ show: false, type: '', message: '' });

  /* ── Input change handler with live validation ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Clear error on change; re-validate only if there was already an error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  /* ── Blur handler — validate on leaving a field ── */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  /* ── Validate entire form ── */
  const validateAll = () => {
    const newErrors = {};
    Object.keys(form).forEach(key => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Submit handler ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, type: '', message: '' });

    if (!validateAll()) {
      setAlert({ show: true, type: 'warning', message: 'Please fix the errors before submitting.' });
      return;
    }

    setLoading(true);
    try {
      const data = await createDonor({
        ...form,
        age: parseInt(form.age, 10),
      });
      setAlert({ show: true, type: 'success', message: data.message || 'Donor registered successfully!' });
      setForm(INITIAL_FORM);
      setErrors({});
      // Scroll to top to show success alert
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setAlert({
        show:    true,
        type:    'danger',
        message: err.message || 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  /* ── Field helper: show error style ── */
  const fieldClass = (name) =>
    `form-control ${errors[name] ? 'is-invalid' : form[name] ? 'is-valid' : ''}`;

  const selectClass = (name) =>
    `form-select ${errors[name] ? 'is-invalid' : form[name] ? 'is-valid' : ''}`;

  return (
    <div className="register-donor-page">

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="container">
          <i className="fas fa-user-plus page-header-icon"></i>
          <h1>Register as a Donor</h1>
          <p>Fill in your details below to join our lifesaving donor network.</p>
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mt-2">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-white-50">Home</Link></li>
              <li className="breadcrumb-item active text-white">Register Donor</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="container register-container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">

            {/* Alert */}
            {alert.show && (
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                autoDismiss={alert.type === 'success' ? 6000 : 0}
              />
            )}

            {/* Form card */}
            <div className="register-card">

              {/* Card header */}
              <div className="register-card-header">
                <div className="register-header-icon">
                  <i className="fas fa-tint"></i>
                </div>
                <div>
                  <h4 className="mb-0">Donor Registration Form</h4>
                  <p className="mb-0 opacity-75 small">All fields marked with <span className="text-danger">*</span> are required.</p>
                </div>
              </div>

              {/* Form body */}
              <div className="register-card-body">
                <form onSubmit={handleSubmit} noValidate>

                  {/* ── Row 1: Name + Age ── */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-8">
                      <label className="form-label" htmlFor="name">
                        <i className="fas fa-user me-1 text-danger"></i>Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        className={fieldClass('name')}
                        placeholder="e.g. John Smith"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={100}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label" htmlFor="age">
                        <i className="fas fa-birthday-cake me-1 text-danger"></i>Age <span className="text-danger">*</span>
                      </label>
                      <input
                        id="age"
                        type="number"
                        name="age"
                        className={fieldClass('age')}
                        placeholder="18–65"
                        value={form.age}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min={18}
                        max={65}
                      />
                      {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                    </div>
                  </div>

                  {/* ── Row 2: Gender + Blood Group ── */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="gender">
                        <i className="fas fa-venus-mars me-1 text-danger"></i>Gender <span className="text-danger">*</span>
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        className={selectClass('gender')}
                        value={form.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="">-- Select Gender --</option>
                        {GENDERS.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label" htmlFor="blood_group">
                        <i className="fas fa-tint me-1 text-danger"></i>Blood Group <span className="text-danger">*</span>
                      </label>
                      <select
                        id="blood_group"
                        name="blood_group"
                        className={selectClass('blood_group')}
                        value={form.blood_group}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="">-- Select Blood Group --</option>
                        {BLOOD_GROUPS.map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                      {errors.blood_group && <div className="invalid-feedback">{errors.blood_group}</div>}
                    </div>
                  </div>

                  {/* ── Row 3: Phone + Email ── */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="phone">
                        <i className="fas fa-phone me-1 text-danger"></i>Phone Number <span className="text-danger">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        className={fieldClass('phone')}
                        placeholder="e.g. +1 555-0123"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={20}
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label" htmlFor="email">
                        <i className="fas fa-envelope me-1 text-danger"></i>Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        className={fieldClass('email')}
                        placeholder="e.g. john@example.com"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={254}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>

                  {/* ── Row 4: Address ── */}
                  <div className="mb-3">
                    <label className="form-label" htmlFor="address">
                      <i className="fas fa-map-marker-alt me-1 text-danger"></i>Address <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      className={fieldClass('address').replace('form-control', 'form-control')}
                      placeholder="e.g. 123 Main Street, Apt 4B"
                      value={form.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={2}
                      maxLength={300}
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>

                  {/* ── Row 5: City ── */}
                  <div className="mb-4">
                    <label className="form-label" htmlFor="city">
                      <i className="fas fa-city me-1 text-danger"></i>City <span className="text-danger">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      className={fieldClass('city')}
                      placeholder="e.g. New York"
                      value={form.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={100}
                    />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>

                  {/* ── Eligibility note ── */}
                  <div className="eligibility-note mb-4">
                    <i className="fas fa-info-circle me-2"></i>
                    <span>
                      You must be <strong>18–65 years old</strong>, weigh at least 50 kg,
                      and be in good health to donate blood.
                    </span>
                  </div>

                  {/* ── Submit button ── */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-submit-register"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" message="" />
                          <span className="ms-2">Registering...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus me-2"></i>Register as Donor
                        </>
                      )}
                    </button>
                  </div>

                  {/* ── Bottom links ── */}
                  <div className="form-bottom-links text-center mt-3">
                    <span className="text-muted small">Already registered? </span>
                    <Link to="/search" className="small fw-600">Find your profile</Link>
                    <span className="text-muted small mx-2">|</span>
                    <Link to="/blood-request" className="small fw-600">Request blood instead</Link>
                  </div>

                </form>
              </div>
            </div>

          </div>

          {/* ── Side info panel ── */}
          <div className="col-lg-4 col-xl-4 d-none d-lg-block">
            <div className="register-sidebar">

              <div className="sidebar-card">
                <h6 className="sidebar-heading">
                  <i className="fas fa-heart me-2 text-danger"></i>Why Donate?
                </h6>
                <ul className="sidebar-list">
                  <li><i className="fas fa-check-circle text-success me-2"></i>Save up to 3 lives per donation</li>
                  <li><i className="fas fa-check-circle text-success me-2"></i>Free health screening</li>
                  <li><i className="fas fa-check-circle text-success me-2"></i>Burns calories (~650 kcal)</li>
                  <li><i className="fas fa-check-circle text-success me-2"></i>Reduces heart disease risk</li>
                  <li><i className="fas fa-check-circle text-success me-2"></i>Blood replenishes in 24 hours</li>
                </ul>
              </div>

              <div className="sidebar-card sidebar-blood-groups">
                <h6 className="sidebar-heading">
                  <i className="fas fa-tint me-2 text-danger"></i>We Accept All Groups
                </h6>
                <div className="sidebar-bg-grid">
                  {BLOOD_GROUPS.map(bg => (
                    <span key={bg} className="sidebar-bg-badge">{bg}</span>
                  ))}
                </div>
              </div>

              <div className="sidebar-card sidebar-contact">
                <h6 className="sidebar-heading">
                  <i className="fas fa-headset me-2 text-danger"></i>Need Help?
                </h6>
                <p className="small text-muted mb-2">Our support team is available 24/7.</p>
                <p className="small mb-1">
                  <i className="fas fa-phone me-2 text-danger"></i>
                  <strong>+1 (800) 555-BLOOD</strong>
                </p>
                <p className="small mb-0">
                  <i className="fas fa-envelope me-2 text-danger"></i>
                  <strong>info@lifeblood.org</strong>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterDonor;
