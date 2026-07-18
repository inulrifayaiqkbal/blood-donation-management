/**
 * Home page — landing page for the Blood Donation Management System.
 *
 * Sections:
 *  1. Hero        — full-screen banner with slogan and CTA buttons
 *  2. Stats       — animated statistic cards
 *  3. Features    — why donate cards
 *  4. Process     — step-by-step donation process
 *  5. Blood Types — all 8 blood group cards
 *  6. CTA Banner  — final call-to-action strip
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

/* ── Static data ── */
const STATS = [
  { icon: 'fas fa-users',          value: '1,200+', label: 'Registered Donors',  color: '#c0392b' },
  { icon: 'fas fa-heartbeat',      value: '4,800+', label: 'Lives Saved',        color: '#8b0000' },
  { icon: 'fas fa-hospital',       value: '150+',   label: 'Partner Hospitals',  color: '#c0392b' },
  { icon: 'fas fa-tint',           value: '6,000+', label: 'Units Donated',      color: '#8b0000' },
];

const FEATURES = [
  {
    icon: 'fas fa-shield-alt',
    title: 'Safe & Secure',
    desc:  'All donor information is stored securely. We follow strict medical privacy standards.',
  },
  {
    icon: 'fas fa-search-location',
    title: 'Find Donors Fast',
    desc:  'Search donors by blood group or city instantly and connect within minutes.',
  },
  {
    icon: 'fas fa-clock',
    title: '24/7 Emergency',
    desc:  'Submit a blood request any time of day or night — our network responds fast.',
  },
  {
    icon: 'fas fa-hand-holding-heart',
    title: 'Easy Registration',
    desc:  'Register as a donor in under 2 minutes. No complex paperwork, just your details.',
  },
  {
    icon: 'fas fa-hospital-alt',
    title: 'Hospital Network',
    desc:  'Partnered with 150+ hospitals and blood banks across the country.',
  },
  {
    icon: 'fas fa-mobile-alt',
    title: 'Always Accessible',
    desc:  'Fully responsive design — works on any device, anytime, anywhere.',
  },
];

const PROCESS = [
  { step: '01', icon: 'fas fa-user-plus',       title: 'Register',   desc: 'Create your donor profile with basic personal and medical information.' },
  { step: '02', icon: 'fas fa-calendar-check',  title: 'Appointment', desc: 'Schedule or walk into a donation camp near your city.' },
  { step: '03', icon: 'fas fa-stethoscope',     title: 'Health Check', desc: 'A quick health screening to ensure you are fit to donate.' },
  { step: '04', icon: 'fas fa-tint',            title: 'Donate',      desc: 'The actual donation takes only 8–10 minutes. Safe and painless.' },
  { step: '05', icon: 'fas fa-heart',           title: 'Save a Life', desc: 'Your blood is processed and delivered to patients in need within hours.' },
];

const BLOOD_GROUPS = [
  { group: 'A+',  donate: 'A+, AB+',            receive: 'A+, A-, O+, O-' },
  { group: 'A-',  donate: 'A+, A-, AB+, AB-',   receive: 'A-, O-' },
  { group: 'B+',  donate: 'B+, AB+',            receive: 'B+, B-, O+, O-' },
  { group: 'B-',  donate: 'B+, B-, AB+, AB-',   receive: 'B-, O-' },
  { group: 'AB+', donate: 'AB+ (Universal Recipient)', receive: 'All Groups' },
  { group: 'AB-', donate: 'AB+, AB-',           receive: 'AB-, A-, B-, O-' },
  { group: 'O+',  donate: 'A+, B+, AB+, O+',    receive: 'O+, O-' },
  { group: 'O-',  donate: 'Everyone (Universal Donor)', receive: 'O-' },
];

/* ── Counter animation hook ── */
const useCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    const numericTarget = parseInt(target.replace(/\D/g, ''), 10);
    const step = Math.ceil(numericTarget / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, numericTarget);
      setCount(current);
      if (current >= numericTarget) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [start, target, duration]);

  return count;
};

/* ── Individual animated stat card ── */
const StatCard = ({ icon, value, label, color, animate }) => {
  const numericPart = value.replace(/\D/g, '');
  const suffix      = value.replace(/[\d,]/g, '');
  const count       = useCounter(numericPart, 2000, animate);

  return (
    <div className="col-6 col-md-3">
      <div className="stat-card animate-fadeInUp">
        <div className="stat-icon" style={{ background: color }}>
          <i className={icon}></i>
        </div>
        <h3 className="stat-value">
          {animate ? count.toLocaleString() : 0}{suffix}
        </h3>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   HOME COMPONENT
   ══════════════════════════════════════════════ */
const Home = () => {
  const [statsVisible, setStatsVisible] = useState(false);

  // Trigger counter animation when stats section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById('stats-section');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">

      {/* ════════════ 1. HERO SECTION ════════════ */}
      <section className="hero-section">
        <div className="hero-bg-overlay"></div>

        {/* Floating decorative drops */}
        <div className="hero-drops">
          <span className="drop drop-1"><i className="fas fa-tint"></i></span>
          <span className="drop drop-2"><i className="fas fa-tint"></i></span>
          <span className="drop drop-3"><i className="fas fa-tint"></i></span>
          <span className="drop drop-4"><i className="fas fa-tint"></i></span>
        </div>

        <div className="container hero-content">
          <div className="row align-items-center min-vh-hero">

            {/* Left — text */}
            <div className="col-lg-6 hero-text-col">
              <span className="hero-badge">
                <i className="fas fa-heartbeat me-2"></i>Blood Donation Management System
              </span>
              <h1 className="hero-title">
                Donate Blood,<br />
                <span className="hero-title-accent">Save Lives.</span>
              </h1>
              <p className="hero-subtitle">
                Every 2 seconds someone needs blood. Become a donor today and be
                the reason someone gets to see tomorrow. Quick registration,
                instant search, 24/7 emergency requests.
              </p>
              <div className="hero-actions">
                <Link to="/register" className="btn btn-hero-primary">
                  <i className="fas fa-heart me-2"></i>Become a Donor
                </Link>
                <Link to="/blood-request" className="btn btn-hero-outline">
                  <i className="fas fa-hand-holding-medical me-2"></i>Request Blood
                </Link>
              </div>
              {/* Trust indicators */}
              <div className="hero-trust">
                <span><i className="fas fa-check-circle me-1 text-success"></i>Free Registration</span>
                <span><i className="fas fa-check-circle me-1 text-success"></i>Safe & Secure</span>
                <span><i className="fas fa-check-circle me-1 text-success"></i>24/7 Support</span>
              </div>
            </div>

            {/* Right — illustration */}
            <div className="col-lg-6 hero-illus-col d-none d-lg-flex">
              <div className="hero-illustration">
                <div className="illus-circle illus-circle-1"></div>
                <div className="illus-circle illus-circle-2"></div>
                <div className="illus-card illus-card-main">
                  <i className="fas fa-tint illus-main-icon"></i>
                  <p className="illus-main-text">Life is in the Blood</p>
                </div>
                <div className="illus-card illus-floating illus-top-right">
                  <i className="fas fa-users me-2"></i>1,200+ Donors
                </div>
                <div className="illus-card illus-floating illus-bottom-left">
                  <i className="fas fa-heartbeat me-2"></i>4,800+ Lives Saved
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Wave divider */}
        <div className="hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f8f9fa"/>
          </svg>
        </div>
      </section>

      {/* ════════════ 2. STATS SECTION ════════════ */}
      <section className="stats-section section-py-sm" id="stats-section">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="section-title">Our Impact</h2>
            <div className="section-divider mx-auto"></div>
            <p className="section-subtitle mt-2">Numbers that reflect lives touched and saved</p>
          </div>
          <div className="row g-4 justify-content-center">
            {STATS.map((stat, i) => (
              <StatCard key={i} {...stat} animate={statsVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 3. FEATURES SECTION ════════════ */}
      <section className="features-section section-py bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">Why Choose Us</span>
            <h2 className="section-title">Everything You Need</h2>
            <div className="section-divider mx-auto"></div>
            <p className="section-subtitle mt-2">
              A complete blood donation platform designed for donors and patients alike.
            </p>
          </div>
          <div className="row g-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="feature-card h-100">
                  <div className="feature-icon-wrap">
                    <i className={f.icon}></i>
                  </div>
                  <h5 className="feature-title">{f.title}</h5>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 4. DONATION PROCESS ════════════ */}
      <section className="process-section section-py">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">Donation Process</h2>
            <div className="section-divider mx-auto"></div>
            <p className="section-subtitle mt-2">Simple, safe, and life-changing in 5 steps.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {PROCESS.map((p, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="process-card">
                  <div className="process-step-num">{p.step}</div>
                  <div className="process-icon">
                    <i className={p.icon}></i>
                  </div>
                  <h5 className="process-title">{p.title}</h5>
                  <p className="process-desc">{p.desc}</p>
                  {i < PROCESS.length - 1 && (
                    <div className="process-arrow d-none d-lg-block">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 5. BLOOD GROUPS ════════════ */}
      <section className="blood-groups-section section-py bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">Compatibility Guide</span>
            <h2 className="section-title">Blood Group Information</h2>
            <div className="section-divider mx-auto"></div>
            <p className="section-subtitle mt-2">
              Know your blood type and who you can donate to or receive from.
            </p>
          </div>
          <div className="row g-3">
            {BLOOD_GROUPS.map((bg, i) => (
              <div key={i} className="col-lg-3 col-md-4 col-sm-6">
                <div className="blood-group-card">
                  <div className="bg-badge">{bg.group}</div>
                  <div className="bg-info">
                    <p><strong>Can Donate To:</strong><br /><span>{bg.donate}</span></p>
                    <p><strong>Can Receive From:</strong><br /><span>{bg.receive}</span></p>
                  </div>
                  <Link to="/search" className="bg-search-link">
                    Find Donors <i className="fas fa-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ 6. CTA BANNER ════════════ */}
      <section className="cta-banner-section">
        <div className="container text-center">
          <i className="fas fa-heartbeat cta-icon mb-3"></i>
          <h2 className="cta-title">Ready to Save a Life?</h2>
          <p className="cta-subtitle">
            Join 1,200+ registered donors. Your single donation can save up to 3 lives.
          </p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-cta-white">
              <i className="fas fa-user-plus me-2"></i>Register as Donor
            </Link>
            <Link to="/search" className="btn btn-cta-outline">
              <i className="fas fa-search me-2"></i>Find a Donor
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
