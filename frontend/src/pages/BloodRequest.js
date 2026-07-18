/**
 * BloodRequest page — form to submit an emergency blood request.
 *
 * Features:
 *  - Full form with per-field validation
 *  - Axios POST to /api/blood-requests/ via api service
 *  - Loading spinner during submission
 *  - Success confirmation panel with reference number
 *  - Error alert feedback
 *  - Sidebar: emergency contacts, how-it-works steps, blood group pills
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createBloodRequest } from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import './BloodRequest.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const INITIAL_FORM = {
  patient_name: '',
  blood_group:  '',
  hospital:     '',
  phone:        '',
  city:         '',
  message:      '',
};

/* ── Per-field validation ── */
const validateField = (name, value) => {
  switch (name) {
    case 'patient_name':
      if (!value.trim()) return 'Patient name is required.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    case 'blood_group':
      return value ? '' : 'Please select the required blood group.';
    case 'hospital':
      if (!value.trim()) return 'Hospital name is required.';
      if (value.trim().length < 3) return 'Please enter a valid hospital name.';
      return '';
    case 'phone':
      if (!value.trim()) return 'Contact number is required.';
      if (!/^[+\d\s\-()]{7,20}$/.test(value.trim())) return 'Enter a valid phone number.';
      return '';
    case 'city':
      if (!value.trim()) return 'City is required.';
      if (value.trim().length < 2) return 'Please enter a valid city name.';
      return '';
    case 'message':
      return ''; // optional
    default:
      return '';
  }
};

/* ══════════════════════════════════════
   BLOOD REQUEST COMPONENT
   ══════════════════════════════════════ */
const BloodRequest = () => {
  const [form,      setForm]      = useState(INITIAL_FORM);
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [alert,     setAlert]     = useState({ show: false, type: '', message: '' });

  /* ── Input handler + live validation ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  /* ── Validate all fields ── */
  const validateAll = () => {
    const newErrors = {};
    Object.keys(form).forEach(key => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, type: '', message: '' });

    if (!validateAll()) {
      setAlert({ show: true, type: 'warning', message: 'Please fix the highlighted errors before submitting.' });
      return;
    }

    setLoading(true);
    try {
      const data = await createBloodRequest(form);
      // Generate a reference number from the returned id
      const ref = `BR-${String(data.request?.id || Date.now()).padStart(6, '0')}`;
      setRefNumber(ref);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setAlert({
        show:    true,
        type:    'danger',
        message: err.message || 'Failed to submit request. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  /* ── Reset to file another request ── */
  const handleNewRequest = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
    setRefNumber('');
    setAlert({ show: false, type: '', message: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Field class helpers */
  const fieldClass = (name) =>
    `form-control${errors[name] ? ' is-invalid' : form[name] ? ' is-valid' : ''}`;

  const selectClass = (name) =>
    `form-select${errors[name] ? ' is-invalid' : form[name] ? ' is-valid' : ''}`;

  return (
    <div className="blood-request-page">

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="container">
          <i
            className="fas fa-hand-holding-medical"
            style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'block', opacity: 0.9 }}
          ></i>
          <h1>Submit Blood Request</h1>
          <p>Need blood urgently? Fill in the details below and we'll connect you with donors.</p>
          <nav aria-label="breadcrumb" className="mt-2">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-white-50">Home</Link></li>
              <li className="breadcrumb-item active text-white">Blood Request</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="container blood-request-container">
        <div className="row justify-content-center">

          {/* ── Left: Form ── */}
          <div className="col-lg-8 col-xl-7">

            {/* Alert */}
            {alert.show && (
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(prev => ({ ...prev, show: false }))}
              />
            )}

            {/* ── Success confirmation ── */}
            {submitted ? (
              <div className="request-success-panel">
                <div className="success-icon-circle">
                  <i className="fas fa-check"></i>
                </div>
                <h3 className="fw-bold text-dark mb-2">Request Submitted!</h3>
                <p className="text-muted mb-3">
                  Your blood request has been received. Our team will match you with
                  available donors and contact you shortly.
                </p>
                <div className="success-ref">
                  Reference Number: <strong>{refNumber}</strong>
                </div>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <button className="btn btn-danger" onClick={handleNewRequest}>
                    <i className="fas fa-plus me-2"></i>Submit Another Request
                  </button>
                  <Link to="/search" className="btn btn-outline-danger">
                    <i className="fas fa-search me-2"></i>Search Donors
                  </Link>
                </div>
              </div>
            ) : (
              /* ── Form card ── */
              <div className="request-card">

                <div className="request-card-header">
                  <div className="request-header-icon">
                    <i className="fas fa-tint"></i>
                  </div>
                  <div>
                    <h4 className="mb-0">Blood Request Form</h4>
                    <p className="mb-0 opacity-75 small">
                      Fields marked <span className="text-warning">*</span> are required.
                    </p>
                  </div>
                </div>

                <div className="request-card-body">

                  {/* Urgency notice */}
                  <div className="urgency-notice">
                    <i className="fas fa-exclamation-triangle"></i>
                    <div className="urgency-notice-text">
                      <strong>For life-threatening emergencies, call 911 immediately.</strong>
                      This form connects you with voluntary donors. Response time is
                      typically within 1–3 hours depending on availability.
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>

                    {/* ── Row 1: Patient name + blood group ── */}
                    <div className="row g-3 mb-3">
                      <div className="col-md-7">
                        <label className="form-label" htmlFor="patient_name">
                          <i className="fas fa-user me-1 text-danger"></i>Patient Name <span className="text-danger">*</span>
                        </label>
                        <input
                          id="patient_name"
                          type="text"
                          name="patient_name"
                          className={fieldClass('patient_name')}
                          placeholder="e.g. Sarah Johnson"
                          value={form.patient_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={100}
                        />
                        {errors.patient_name && (
                          <div className="invalid-feedback">{errors.patient_name}</div>
                        )}
                      </div>

                      <div className="col-md-5">
                        <label className="form-label" htmlFor="blood_group">
                          <i className="fas fa-tint me-1 text-danger"></i>Blood Group Needed <span className="text-danger">*</span>
                        </label>
                        <select
                          id="blood_group"
                          name="blood_group"
                          className={selectClass('blood_group')}
                          value={form.blood_group}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="">-- Select --</option>
                          {BLOOD_GROUPS.map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                        {errors.blood_group && (
                          <div className="invalid-feedback">{errors.blood_group}</div>
                        )}
                      </div>
                    </div>

                    {/* ── Row 2: Hospital ── */}
                    <div className="mb-3">
                      <label className="form-label" htmlFor="hospital">
                        <i className="fas fa-hospital me-1 text-danger"></i>Hospital / Clinic Name <span className="text-danger">*</span>
                      </label>
                      <input
                        id="hospital"
                        type="text"
                        name="hospital"
                        className={fieldClass('hospital')}
                        placeholder="e.g. City General Hospital"
                        value={form.hospital}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={200}
                      />
                      {errors.hospital && (
                        <div className="invalid-feedback">{errors.hospital}</div>
                      )}
                    </div>

                    {/* ── Row 3: Phone + City ── */}
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label" htmlFor="req-phone">
                          <i className="fas fa-phone me-1 text-danger"></i>Contact Number <span className="text-danger">*</span>
                        </label>
                        <input
                          id="req-phone"
                          type="tel"
                          name="phone"
                          className={fieldClass('phone')}
                          placeholder="e.g. +1 555-0123"
                          value={form.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={20}
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">{errors.phone}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label" htmlFor="req-city">
                          <i className="fas fa-city me-1 text-danger"></i>City <span className="text-danger">*</span>
                        </label>
                        <input
                          id="req-city"
                          type="text"
                          name="city"
                          className={fieldClass('city')}
                          placeholder="e.g. Chicago"
                          value={form.city}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={100}
                        />
                        {errors.city && (
                          <div className="invalid-feedback">{errors.city}</div>
                        )}
                      </div>
                    </div>

                    {/* ── Row 4: Message ── */}
                    <div className="mb-4">
                      <label className="form-label" htmlFor="message">
                        <i className="fas fa-comment-alt me-1 text-danger"></i>
                        Additional Information{' '}
                        <span className="text-muted fw-normal">(Optional)</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        className="form-control"
                        placeholder="Any additional details about the request, urgency level, ward number, etc."
                        value={form.message}
                        onChange={handleChange}
                        rows={3}
                        maxLength={500}
                      />
                      <div className="d-flex justify-content-end mt-1">
                        <small className="text-muted">{form.message.length}/500</small>
                      </div>
                    </div>

                    {/* ── Submit ── */}
                    <button
                      type="submit"
                      className="btn-submit-request"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" message="" />
                          <span className="ms-2">Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>Submit Blood Request
                        </>
                      )}
                    </button>

                    <div className="text-center mt-3">
                      <span className="text-muted small">Want to help instead? </span>
                      <Link to="/register" className="small fw-bold">Register as a donor</Link>
                    </div>

                  </form>
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="col-lg-4 col-xl-4 d-none d-lg-block">
            <div className="request-sidebar">

              {/* Emergency contacts */}
              <div className="request-sidebar-card">
                <h6 className="sidebar-card-title">
                  <i className="fas fa-phone-alt me-2 text-danger"></i>Emergency Contacts
                </h6>

                <div className="emergency-contact-item">
                  <div className="emergency-icon">
                    <i className="fas fa-ambulance"></i>
                  </div>
                  <div>
                    <span className="emergency-label">Emergency Services</span>
                    <span className="emergency-value">911</span>
                  </div>
                </div>

                <div className="emergency-contact-item">
                  <div className="emergency-icon">
                    <i className="fas fa-tint"></i>
                  </div>
                  <div>
                    <span className="emergency-label">Blood Bank Hotline</span>
                    <span className="emergency-value">+1 (800) 555-BLOOD</span>
                  </div>
                </div>

                <div className="emergency-contact-item">
                  <div className="emergency-icon">
                    <i className="fas fa-hospital"></i>
                  </div>
                  <div>
                    <span className="emergency-label">24/7 Support</span>
                    <span className="emergency-value">info@lifeblood.org</span>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="request-sidebar-card">
                <h6 className="sidebar-card-title">
                  <i className="fas fa-info-circle me-2 text-danger"></i>How It Works
                </h6>
                <ol className="steps-list">
                  {[
                    'Submit this form with patient details.',
                    'We match the request with nearby donors.',
                    'Matched donors are notified instantly.',
                    'Donor contacts you or the hospital directly.',
                    'Blood is donated and lives are saved.',
                  ].map((step, i) => (
                    <li key={i}>
                      <span className="step-num">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Blood groups available */}
              <div className="request-sidebar-card">
                <h6 className="sidebar-card-title">
                  <i className="fas fa-tint me-2 text-danger"></i>Available Blood Groups
                </h6>
                <div className="bg-compact-grid">
                  {BLOOD_GROUPS.map(bg => (
                    <span key={bg} className="bg-compact-pill">{bg}</span>
                  ))}
                </div>
                <p className="small text-muted mt-2 mb-0">
                  <i className="fas fa-info-circle me-1 text-danger"></i>
                  O- is the universal donor. AB+ is the universal recipient.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BloodRequest;
