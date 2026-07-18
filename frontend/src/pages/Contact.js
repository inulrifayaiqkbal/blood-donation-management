/**
 * Contact page — contact information + message form.
 *
 * Features:
 *  - Four info cards (address, phone, email, hours)
 *  - Contact form with per-field validation
 *  - Simulated message submission (no backend endpoint needed)
 *  - Success state after submission
 *  - Sidebar: office hours, social links, FAQ accordion
 *  - Map placeholder section
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import './Contact.css';

/* ── Contact info cards data ── */
const INFO_CARDS = [
  {
    icon:  'fas fa-map-marker-alt',
    label: 'Our Address',
    value: '123 Medical Center Drive',
    sub:   'Health City, HC 45678',
  },
  {
    icon:  'fas fa-phone-alt',
    label: 'Phone',
    value: '+1 (800) 555-BLOOD',
    sub:   '24/7 Emergency Line',
  },
  {
    icon:  'fas fa-envelope',
    label: 'Email',
    value: 'info@lifeblood.org',
    sub:   'We reply within 2 hours',
  },
  {
    icon:  'fas fa-clock',
    label: 'Working Hours',
    value: 'Mon – Fri: 8am – 8pm',
    sub:   'Sat – Sun: 9am – 5pm',
  },
];

/* ── Office hours ── */
const HOURS = [
  { day: 'Monday',    time: '8:00 AM – 8:00 PM' },
  { day: 'Tuesday',   time: '8:00 AM – 8:00 PM' },
  { day: 'Wednesday', time: '8:00 AM – 8:00 PM' },
  { day: 'Thursday',  time: '8:00 AM – 8:00 PM' },
  { day: 'Friday',    time: '8:00 AM – 6:00 PM' },
  { day: 'Saturday',  time: '9:00 AM – 5:00 PM' },
  { day: 'Sunday',    time: null },                   // null = Closed
];

/* ── FAQ data ── */
const FAQS = [
  {
    q: 'Who can donate blood?',
    a: 'Anyone aged 18–65 who weighs at least 50 kg and is in good general health. Some medical conditions may affect eligibility.',
  },
  {
    q: 'How often can I donate?',
    a: 'Whole blood can be donated every 56 days (8 weeks). Platelets can be donated every 7 days, up to 24 times per year.',
  },
  {
    q: 'Is blood donation safe?',
    a: 'Yes. All equipment used is sterile and single-use. Donating blood carries no risk of infection for the donor.',
  },
  {
    q: 'How do I find a donor urgently?',
    a: 'Submit a Blood Request through our website or call our 24/7 emergency hotline at +1 (800) 555-BLOOD.',
  },
];

/* ── Initial form state ── */
const INITIAL_FORM = {
  name:    '',
  email:   '',
  subject: '',
  message: '',
};

/* ── Per-field validation ── */
const validateField = (name, value) => {
  switch (name) {
    case 'name':
      if (!value.trim())          return 'Your name is required.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    case 'email':
      if (!value.trim())          return 'Email address is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
                                   return 'Enter a valid email address.';
      return '';
    case 'subject':
      if (!value.trim())          return 'Subject is required.';
      if (value.trim().length < 3) return 'Subject must be at least 3 characters.';
      return '';
    case 'message':
      if (!value.trim())          return 'Message is required.';
      if (value.trim().length < 20) return 'Message must be at least 20 characters.';
      return '';
    default:
      return '';
  }
};

/* ══════════════════════════════════════
   CONTACT COMPONENT
   ══════════════════════════════════════ */
const Contact = () => {
  const [form,      setForm]      = useState(INITIAL_FORM);
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alert,     setAlert]     = useState({ show: false, type: '', message: '' });

  /* Open FAQ item index (null = all closed) */
  const [openFaq, setOpenFaq] = useState(null);

  /* ── Handlers ── */
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

  const validateAll = () => {
    const newErrors = {};
    Object.keys(form).forEach(key => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* Simulate sending a message (no dedicated backend endpoint) */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, type: '', message: '' });

    if (!validateAll()) {
      setAlert({ show: true, type: 'warning', message: 'Please fix the highlighted errors.' });
      return;
    }

    setLoading(true);
    try {
      /* Simulate a 1.2-second network delay */
      await new Promise(resolve => setTimeout(resolve, 1200));
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setAlert({ show: true, type: 'danger', message: 'Message sending failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
    setAlert({ show: false, type: '', message: '' });
  };

  const fc = (name) =>
    `form-control${errors[name] ? ' is-invalid' : form[name] ? ' is-valid' : ''}`;

  const msgLen   = form.message.length;
  const msgLimit = 1000;

  return (
    <div className="contact-page">

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="container">
          <i
            className="fas fa-envelope"
            style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'block', opacity: 0.9 }}
          ></i>
          <h1>Contact Us</h1>
          <p>Have a question or need help? We'd love to hear from you.</p>
          <nav aria-label="breadcrumb" className="mt-2">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white-50">Home</Link>
              </li>
              <li className="breadcrumb-item active text-white">Contact</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container contact-container">

        {/* ── Info cards ── */}
        <div className="contact-info-cards">
          {INFO_CARDS.map((card, i) => (
            <div className="contact-info-card" key={i}>
              <div className="contact-info-icon">
                <i className={card.icon}></i>
              </div>
              <p className="contact-info-label">{card.label}</p>
              <p className="contact-info-value">{card.value}</p>
              {card.sub && <span className="contact-info-sub">{card.sub}</span>}
            </div>
          ))}
        </div>

        {/* ── Alert ── */}
        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(prev => ({ ...prev, show: false }))}
          />
        )}

        {/* ── Two-column layout ── */}
        <div className="contact-main-row">

          {/* ── Contact Form Card ── */}
          <div className="contact-form-card">
            <div className="contact-form-header">
              <div className="contact-form-header-icon">
                <i className="fas fa-paper-plane"></i>
              </div>
              <div>
                <h4>Send Us a Message</h4>
                <p>We'll get back to you within 2 hours.</p>
              </div>
            </div>

            <div className="contact-form-body">
              {submitted ? (
                /* ── Success state ── */
                <div className="contact-success-state">
                  <div className="contact-success-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <h4 className="fw-bold text-dark mb-2">Message Sent!</h4>
                  <p className="text-muted mb-1">
                    Thank you, <strong>{form.name || 'friend'}</strong>! Your message has been received.
                  </p>
                  <p className="text-muted small mb-4">
                    We'll reply to <strong>{form.email}</strong> within 2 hours.
                  </p>
                  <div className="d-flex flex-wrap justify-content-center gap-3">
                    <button className="btn btn-danger" onClick={handleNewMessage}>
                      <i className="fas fa-pen me-2"></i>Send Another Message
                    </button>
                    <Link to="/" className="btn btn-outline-danger">
                      <i className="fas fa-home me-2"></i>Back to Home
                    </Link>
                  </div>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit} noValidate>

                  {/* Name + Email */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="contact-name">
                        <i className="fas fa-user me-1 text-danger"></i>
                        Your Name <span className="text-danger">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        className={fc('name')}
                        placeholder="e.g. John Smith"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={100}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label" htmlFor="contact-email">
                        <i className="fas fa-envelope me-1 text-danger"></i>
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        className={fc('email')}
                        placeholder="e.g. john@example.com"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={254}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mb-3">
                    <label className="form-label" htmlFor="contact-subject">
                      <i className="fas fa-tag me-1 text-danger"></i>
                      Subject <span className="text-danger">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      className={fc('subject')}
                      placeholder="e.g. Question about blood donation eligibility"
                      value={form.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={200}
                    />
                    {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                  </div>

                  {/* Message */}
                  <div className="mb-4">
                    <label className="form-label" htmlFor="contact-message">
                      <i className="fas fa-comment-dots me-1 text-danger"></i>
                      Message <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className={fc('message')}
                      placeholder="Write your message here. Please include as much detail as possible..."
                      value={form.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={5}
                      maxLength={msgLimit}
                    />
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      {errors.message
                        ? <div className="invalid-feedback d-block">{errors.message}</div>
                        : <span />
                      }
                      <span className={`char-counter ${msgLen > msgLimit * 0.85 ? 'near-limit' : ''}`}>
                        {msgLen}/{msgLimit}
                      </span>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn-contact-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" message="" />
                        <span className="ms-2">Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>Send Message
                      </>
                    )}
                  </button>

                </form>
              )}
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="contact-sidebar">

            {/* Office hours */}
            <div className="contact-side-card">
              <h6 className="contact-side-card-title">
                <i className="fas fa-clock me-2"></i>Office Hours
              </h6>
              <ul className="hours-list">
                {HOURS.map(({ day, time }) => (
                  <li key={day}>
                    <span className="day">{day}</span>
                    {time
                      ? <span className="time">{time}</span>
                      : <span className="hours-badge-closed">Closed</span>
                    }
                  </li>
                ))}
              </ul>
              <p className="small text-muted mt-2 mb-0">
                <i className="fas fa-phone-alt me-1 text-danger"></i>
                Emergency line operates <strong>24/7</strong>.
              </p>
            </div>

            {/* Social links */}
            <div className="contact-side-card">
              <h6 className="contact-side-card-title">
                <i className="fas fa-share-alt me-2"></i>Follow Us
              </h6>
              <div className="contact-social-grid">
                <a href="#!" className="contact-social-btn social-fb" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>Facebook
                </a>
                <a href="#!" className="contact-social-btn social-tw" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>Twitter
                </a>
                <a href="#!" className="contact-social-btn social-wa" aria-label="WhatsApp">
                  <i className="fab fa-whatsapp"></i>WhatsApp
                </a>
                <a href="#!" className="contact-social-btn social-ig" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>Instagram
                </a>
              </div>
            </div>

            {/* FAQ accordion */}
            <div className="contact-side-card">
              <h6 className="contact-side-card-title">
                <i className="fas fa-question-circle me-2"></i>Quick FAQ
              </h6>
              {FAQS.map((faq, i) => (
                <div className="faq-item" key={i}>
                  <button
                    className={`faq-question ${openFaq === i ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span>{faq.q}</span>
                    <i className="fas fa-chevron-down"></i>
                  </button>
                  {openFaq === i && (
                    <p className="faq-answer">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Map placeholder ── */}
        <div className="map-placeholder">
          <i className="fas fa-map-marked-alt"></i>
          <h6>Find Us on the Map</h6>
          <p>123 Medical Center Drive, Health City, HC 45678</p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-danger btn-sm mt-3"
          >
            <i className="fas fa-external-link-alt me-2"></i>Open in Google Maps
          </a>
        </div>

      </div>
    </div>
  );
};

export default Contact;
