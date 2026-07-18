/**
 * SearchDonors page — search blood donors by blood group and/or city.
 *
 * Features:
 *  - Filter by blood group (dropdown)
 *  - Filter by city (text input)
 *  - General keyword search
 *  - Responsive donor card grid
 *  - Loading spinner & empty-state
 *  - Active filter chips with one-click removal
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getDonors } from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import './SearchDonors.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

/* Format date nicely */
const formatDate = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

/* ── Single donor card ── */
const DonorCard = ({ donor }) => (
  <div className="col-sm-6 col-lg-4 col-xl-3">
    <div className="donor-card">
      {/* Header: blood badge + name */}
      <div className="donor-card-header">
        <div className="donor-blood-badge">{donor.blood_group}</div>
        <div>
          <h6 className="donor-name">{donor.name}</h6>
          <p className="donor-gender-age">{donor.gender} · {donor.age} years old</p>
        </div>
      </div>

      {/* Detail rows */}
      <div className="donor-detail-item">
        <i className="fas fa-city"></i>
        <span>{donor.city}</span>
      </div>
      <div className="donor-detail-item">
        <i className="fas fa-phone"></i>
        <span>{donor.phone}</span>
      </div>
      <div className="donor-detail-item">
        <i className="fas fa-envelope"></i>
        <span style={{ wordBreak: 'break-all' }}>{donor.email}</span>
      </div>

      {/* Footer */}
      <div className="donor-card-footer">
        <span className="donor-date">
          <i className="fas fa-clock me-1"></i>
          {formatDate(donor.created_at)}
        </span>
        <a href={`mailto:${donor.email}`} className="btn-contact-donor">
          <i className="fas fa-envelope me-1"></i>Contact
        </a>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════
   SEARCH DONORS COMPONENT
   ══════════════════════════════════════ */
const SearchDonors = () => {
  const [donors,      setDonors]      = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [alert,       setAlert]       = useState({ show: false, type: '', message: '' });

  /* Filter state */
  const [bloodGroup, setBloodGroup] = useState('');
  const [city,       setCity]       = useState('');
  const [keyword,    setKeyword]    = useState('');

  /* Fetch donors from API */
  const fetchDonors = useCallback(async (params = {}) => {
    setLoading(true);
    setAlert({ show: false, type: '', message: '' });
    try {
      const data = await getDonors(params);
      setDonors(data.donors || []);
      setHasSearched(true);
    } catch (err) {
      setAlert({ show: true, type: 'danger', message: err.message || 'Failed to fetch donors.' });
      setDonors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Load all donors on mount */
  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  /* Build search params and fetch */
  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (bloodGroup) params.blood_group = bloodGroup;
    if (city.trim()) params.city       = city.trim();
    if (keyword.trim()) params.search  = keyword.trim();
    fetchDonors(params);
  };

  /* Clear all filters */
  const handleClear = () => {
    setBloodGroup('');
    setCity('');
    setKeyword('');
    fetchDonors();
  };

  /* Remove a single active filter */
  const removeFilter = (filterName) => {
    const updates = { blood_group: bloodGroup, city, search: keyword };
    if (filterName === 'blood_group') { setBloodGroup(''); delete updates.blood_group; }
    if (filterName === 'city')        { setCity('');       delete updates.city; }
    if (filterName === 'keyword')     { setKeyword('');    delete updates.search; }
    // Re-run search with remaining filters
    const params = {};
    if (updates.blood_group) params.blood_group = updates.blood_group;
    if (updates.city)        params.city        = updates.city;
    if (updates.search)      params.search      = updates.search;
    fetchDonors(params);
  };

  const hasActiveFilters = bloodGroup || city.trim() || keyword.trim();

  return (
    <div className="search-donors-page">

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="container">
          <i className="fas fa-search page-header-icon" style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'block', opacity: 0.9 }}></i>
          <h1>Search Blood Donors</h1>
          <p>Find compatible donors in your area quickly and easily.</p>
          <nav aria-label="breadcrumb" className="mt-2">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-white-50">Home</Link></li>
              <li className="breadcrumb-item active text-white">Search Donors</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="container py-4">

        {/* Alert */}
        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(prev => ({ ...prev, show: false }))}
          />
        )}

        {/* ── Search panel ── */}
        <div className="search-panel">
          <h5 className="search-panel-title">
            <i className="fas fa-filter me-2"></i>Filter Donors
          </h5>

          <form onSubmit={handleSearch}>
            <div className="search-filters">

              {/* Blood group */}
              <div className="filter-group">
                <label htmlFor="bg-filter">
                  <i className="fas fa-tint me-1 text-danger"></i>Blood Group
                </label>
                <select
                  id="bg-filter"
                  className="form-select"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                >
                  <option value="">All Blood Groups</option>
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="filter-group">
                <label htmlFor="city-filter">
                  <i className="fas fa-city me-1 text-danger"></i>City
                </label>
                <input
                  id="city-filter"
                  type="text"
                  className="form-control"
                  placeholder="Enter city name..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  maxLength={100}
                />
              </div>

              {/* Keyword */}
              <div className="filter-group">
                <label htmlFor="keyword-filter">
                  <i className="fas fa-keyboard me-1 text-danger"></i>Keyword
                </label>
                <input
                  id="keyword-filter"
                  type="text"
                  className="form-control"
                  placeholder="Name, email..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  maxLength={100}
                />
              </div>

              {/* Buttons */}
              <div className="filter-group" style={{ flex: '0 0 auto' }}>
                <label style={{ visibility: 'hidden', display: 'block' }}>—</label>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn-search" disabled={loading}>
                    <i className="fas fa-search me-1"></i>
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                  {hasActiveFilters && (
                    <button type="button" className="btn-clear-search" onClick={handleClear}>
                      <i className="fas fa-times me-1"></i>Clear
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="active-filters">
                <span className="text-muted small me-1">Active filters:</span>
                {bloodGroup && (
                  <span className="filter-chip">
                    <i className="fas fa-tint me-1"></i>{bloodGroup}
                    <button className="filter-chip-remove" onClick={() => removeFilter('blood_group')} type="button" aria-label="Remove blood group filter">
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                )}
                {city.trim() && (
                  <span className="filter-chip">
                    <i className="fas fa-city me-1"></i>{city}
                    <button className="filter-chip-remove" onClick={() => removeFilter('city')} type="button" aria-label="Remove city filter">
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                )}
                {keyword.trim() && (
                  <span className="filter-chip">
                    <i className="fas fa-search me-1"></i>{keyword}
                    <button className="filter-chip-remove" onClick={() => removeFilter('keyword')} type="button" aria-label="Remove keyword filter">
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                )}
              </div>
            )}
          </form>
        </div>

        {/* ── Results ── */}
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner message="Searching for donors..." />
          </div>
        ) : (
          <>
            {/* Results header */}
            {hasSearched && (
              <div className="results-header">
                <h6 className="mb-0 fw-bold text-dark">
                  {donors.length > 0
                    ? `Showing ${donors.length} donor${donors.length !== 1 ? 's' : ''}`
                    : 'No donors found'
                  }
                </h6>
                {donors.length > 0 && (
                  <span className="results-count-badge">
                    <i className="fas fa-users me-1"></i>{donors.length} result{donors.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}

            {/* Donor cards */}
            {donors.length > 0 ? (
              <div className="row g-3 donors-grid">
                {donors.map(donor => (
                  <DonorCard key={donor.id} donor={donor} />
                ))}
              </div>
            ) : (
              hasSearched && (
                <div className="empty-state">
                  <i className="fas fa-user-slash empty-state-icon"></i>
                  <h5>No Donors Found</h5>
                  <p>
                    {hasActiveFilters
                      ? 'No donors match your current filters. Try adjusting your search.'
                      : 'No donors are registered yet. Be the first to register!'}
                  </p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    {hasActiveFilters && (
                      <button className="btn btn-outline-danger btn-sm" onClick={handleClear}>
                        <i className="fas fa-times me-1"></i>Clear Filters
                      </button>
                    )}
                    <Link to="/register" className="btn btn-danger btn-sm">
                      <i className="fas fa-user-plus me-1"></i>Register as Donor
                    </Link>
                  </div>
                </div>
              )
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default SearchDonors;
