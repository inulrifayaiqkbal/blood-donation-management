/**
 * ManageDonors page — admin panel to view, search, edit, and delete donors.
 *
 * Features:
 *  - Fetches all donors from /api/donors/ on mount
 *  - Client-side search and blood-group filter on the loaded data
 *  - Bootstrap-style responsive table with action buttons
 *  - Client-side pagination (10 rows per page)
 *  - Inline Edit modal — prefills form, submits PUT via updateDonor
 *  - Delete confirmation modal — calls deleteDonor
 *  - Stats bar (total, male, female, unique cities)
 *  - Success / error alerts
 *  - Loading spinner
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getDonors, updateDonor, deleteDonor } from '../services/api';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import './ManageDonors.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS      = ['Male', 'Female', 'Other'];
const PAGE_SIZE    = 10;

/* Format ISO date */
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

/* ── Edit Modal ── */
const EditModal = ({ donor, onClose, onSaved }) => {
  const [form,    setForm]    = useState({ ...donor });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [alert,   setAlert]   = useState({ show: false, type: '', message: '' });

  const validate = () => {
    const e = {};
    if (!form.name?.trim())       e.name        = 'Name is required.';
    if (!form.age || form.age < 18 || form.age > 65)
                                   e.age         = 'Age must be 18–65.';
    if (!form.gender)             e.gender      = 'Select a gender.';
    if (!form.blood_group)        e.blood_group = 'Select a blood group.';
    if (!form.phone?.trim())      e.phone       = 'Phone is required.';
    if (!form.email?.trim())      e.email       = 'Email is required.';
    if (!form.address?.trim())    e.address     = 'Address is required.';
    if (!form.city?.trim())       e.city        = 'City is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    setAlert({ show: false, type: '', message: '' });
    try {
      const data = await updateDonor(donor.id, { ...form, age: parseInt(form.age, 10) });
      onSaved(data.donor);
    } catch (err) {
      setAlert({ show: true, type: 'danger', message: err.message || 'Update failed.' });
    } finally {
      setLoading(false);
    }
  };

  const fc = (name) =>
    `form-control form-control-sm${errors[name] ? ' is-invalid' : ''}`;
  const sc = (name) =>
    `form-select form-select-sm${errors[name] ? ' is-invalid' : ''}`;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-box-header">
          <h5><i className="fas fa-user-edit me-2"></i>Edit Donor — {donor.name}</h5>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-box-body">
          {alert.show && (
            <Alert type={alert.type} message={alert.message}
              onClose={() => setAlert(prev => ({ ...prev, show: false }))} />
          )}

          <div className="row g-3">
            {/* Name */}
            <div className="col-md-8">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className={fc('name')}
                value={form.name} onChange={handleChange} maxLength={100} />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            {/* Age */}
            <div className="col-md-4">
              <label className="form-label">Age</label>
              <input type="number" name="age" className={fc('age')}
                value={form.age} onChange={handleChange} min={18} max={65} />
              {errors.age && <div className="invalid-feedback">{errors.age}</div>}
            </div>

            {/* Gender */}
            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select name="gender" className={sc('gender')}
                value={form.gender} onChange={handleChange}>
                <option value="">-- Select --</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
            </div>

            {/* Blood group */}
            <div className="col-md-6">
              <label className="form-label">Blood Group</label>
              <select name="blood_group" className={sc('blood_group')}
                value={form.blood_group} onChange={handleChange}>
                <option value="">-- Select --</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
              {errors.blood_group && <div className="invalid-feedback">{errors.blood_group}</div>}
            </div>

            {/* Phone */}
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input type="tel" name="phone" className={fc('phone')}
                value={form.phone} onChange={handleChange} maxLength={20} />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" name="email" className={fc('email')}
                value={form.email} onChange={handleChange} maxLength={254} />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Address */}
            <div className="col-12">
              <label className="form-label">Address</label>
              <textarea name="address" className={fc('address')}
                value={form.address} onChange={handleChange} rows={2} maxLength={300} />
              {errors.address && <div className="invalid-feedback">{errors.address}</div>}
            </div>

            {/* City */}
            <div className="col-12">
              <label className="form-label">City</label>
              <input type="text" name="city" className={fc('city')}
                value={form.city} onChange={handleChange} maxLength={100} />
              {errors.city && <div className="invalid-feedback">{errors.city}</div>}
            </div>
          </div>
        </div>

        <div className="modal-box-footer">
          <button className="btn-modal-cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn-modal-save" onClick={handleSave} disabled={loading}>
            {loading
              ? <><i className="fas fa-spinner fa-spin me-2"></i>Saving...</>
              : <><i className="fas fa-save me-2"></i>Save Changes</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Delete Confirm Modal ── */
const DeleteModal = ({ donor, onClose, onConfirm, loading }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal-box" style={{ maxWidth: 420 }}>
      <div className="modal-box-header">
        <h5><i className="fas fa-trash-alt me-2"></i>Delete Donor</h5>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="modal-box-body text-center py-2">
        <div className="delete-modal-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h6 className="fw-bold">Are you sure?</h6>
        <p className="text-muted small mb-1">
          You are about to permanently delete the donor record for:
        </p>
        <p className="fw-bold text-danger mb-0">{donor.name}</p>
        <p className="text-muted small">({donor.blood_group} · {donor.city})</p>
        <p className="text-muted small">This action cannot be undone.</p>
      </div>

      <div className="modal-box-footer">
        <button className="btn-modal-cancel" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button
          className="btn btn-danger btn-sm px-4"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading
            ? <><i className="fas fa-spinner fa-spin me-2"></i>Deleting...</>
            : <><i className="fas fa-trash-alt me-2"></i>Yes, Delete</>
          }
        </button>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════
   MANAGE DONORS COMPONENT
   ══════════════════════════════════════ */
const ManageDonors = () => {
  const [donors,       setDonors]       = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [alert,        setAlert]        = useState({ show: false, type: '', message: '' });

  /* Filters */
  const [search,       setSearch]       = useState('');
  const [bgFilter,     setBgFilter]     = useState('');

  /* Pagination */
  const [currentPage,  setCurrentPage]  = useState(1);

  /* Modals */
  const [editDonor,    setEditDonor]    = useState(null);
  const [deletingDonor, setDeletingDonor] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ── Fetch all donors ── */
  const fetchDonors = useCallback(async () => {
    setLoading(true);
    setAlert({ show: false, type: '', message: '' });
    try {
      const data = await getDonors();
      setDonors(data.donors || []);
    } catch (err) {
      setAlert({ show: true, type: 'danger', message: err.message || 'Failed to load donors.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDonors(); }, [fetchDonors]);

  /* ── Client-side filtering ── */
  const filtered = useMemo(() => {
    let list = [...donors];
    if (bgFilter) {
      list = list.filter(d => d.blood_group === bgFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q)   ||
        d.email.toLowerCase().includes(q)  ||
        d.city.toLowerCase().includes(q)   ||
        d.phone.includes(q)
      );
    }
    return list;
  }, [donors, search, bgFilter]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(currentPage, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Reset to page 1 whenever filter changes
  useEffect(() => { setCurrentPage(1); }, [search, bgFilter]);

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total:  donors.length,
    male:   donors.filter(d => d.gender === 'Male').length,
    female: donors.filter(d => d.gender === 'Female').length,
    cities: new Set(donors.map(d => d.city.toLowerCase())).size,
  }), [donors]);

  /* ── Handlers ── */
  const handleEditSaved = (updatedDonor) => {
    setDonors(prev => prev.map(d => d.id === updatedDonor.id ? updatedDonor : d));
    setEditDonor(null);
    setAlert({ show: true, type: 'success', message: `"${updatedDonor.name}" updated successfully.` });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDonor) return;
    setDeleteLoading(true);
    try {
      await deleteDonor(deletingDonor.id);
      setDonors(prev => prev.filter(d => d.id !== deletingDonor.id));
      setAlert({ show: true, type: 'success', message: `"${deletingDonor.name}" deleted successfully.` });
    } catch (err) {
      setAlert({ show: true, type: 'danger', message: err.message || 'Delete failed.' });
    } finally {
      setDeleteLoading(false);
      setDeletingDonor(null);
    }
  };

  /* ── Page range for pagination buttons ── */
  const pageRange = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(1, safePage - delta);
      i <= Math.min(totalPages, safePage + delta);
      i++
    ) range.push(i);
    return range;
  };

  return (
    <div className="manage-donors-page">

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="container">
          <i
            className="fas fa-users-cog"
            style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'block', opacity: 0.9 }}
          ></i>
          <h1>Manage Donors</h1>
          <p>View, edit, and remove donor records from the system.</p>
          <nav aria-label="breadcrumb" className="mt-2">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-white-50">Home</Link></li>
              <li className="breadcrumb-item active text-white">Manage Donors</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container manage-container">

        {/* ── Alert ── */}
        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(prev => ({ ...prev, show: false }))}
            autoDismiss={alert.type === 'success' ? 4000 : 0}
          />
        )}

        {/* ── Stats bar ── */}
        <div className="manage-stats-bar">
          {[
            { icon: 'fas fa-users',        value: stats.total,  label: 'Total Donors' },
            { icon: 'fas fa-male',          value: stats.male,   label: 'Male Donors'  },
            { icon: 'fas fa-female',        value: stats.female, label: 'Female Donors' },
            { icon: 'fas fa-city',          value: stats.cities, label: 'Cities Covered' },
          ].map((s, i) => (
            <div className="manage-stat-pill" key={i}>
              <div className="stat-pill-icon">
                <i className={s.icon}></i>
              </div>
              <div>
                <div className="stat-pill-value">{s.value}</div>
                <div className="stat-pill-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="manage-toolbar">
          {/* Search input */}
          <div className="toolbar-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by name, email, city, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Blood group filter */}
          <select
            className="toolbar-select"
            value={bgFilter}
            onChange={(e) => setBgFilter(e.target.value)}
          >
            <option value="">All Blood Groups</option>
            {BLOOD_GROUPS.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>

          {/* Refresh */}
          <button className="btn-toolbar-refresh" onClick={fetchDonors} disabled={loading}>
            <i className={`fas fa-sync-alt me-1 ${loading ? 'fa-spin' : ''}`}></i>
            Refresh
          </button>

          {/* Add donor */}
          <Link to="/register" className="btn-add-donor">
            <i className="fas fa-user-plus me-2"></i>Add Donor
          </Link>
        </div>

        {/* ── Table card ── */}
        <div className="table-card">
          <div className="table-card-header">
            <h6 className="table-card-title">
              <i className="fas fa-table me-2"></i>Donor Records
            </h6>
            <span className="table-results-badge">
              {filtered.length} of {donors.length} donors
            </span>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner message="Loading donors..." />
            </div>
          ) : (
            <div className="table-responsive-wrapper">
              <table className="manage-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Blood</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length > 0 ? (
                    paginated.map((donor, idx) => (
                      <tr key={donor.id}>
                        <td className="td-num">
                          {(safePage - 1) * PAGE_SIZE + idx + 1}
                        </td>

                        <td>
                          <span className="tbl-blood-badge">{donor.blood_group}</span>
                        </td>

                        <td>
                          <span className="td-name">{donor.name}</span>
                          <span className="td-sub">{donor.email}</span>
                        </td>

                        <td>{donor.age}</td>
                        <td>{donor.gender}</td>
                        <td>{donor.phone}</td>

                        <td>
                          <span className="city-pill">{donor.city}</span>
                        </td>

                        <td style={{ whiteSpace: 'nowrap' }}>
                          {fmtDate(donor.created_at)}
                        </td>

                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn-tbl-edit"
                              title="Edit donor"
                              onClick={() => setEditDonor(donor)}
                              aria-label={`Edit ${donor.name}`}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn-tbl-delete"
                              title="Delete donor"
                              onClick={() => setDeletingDonor(donor)}
                              aria-label={`Delete ${donor.name}`}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="tbl-empty-row">
                      <td colSpan={9}>
                        <i className="fas fa-users-slash tbl-empty-icon"></i>
                        <p className="fw-bold text-muted mb-1">No donors found</p>
                        <p className="text-muted small mb-3">
                          {search || bgFilter
                            ? 'Try adjusting your search or filter.'
                            : 'No donors are registered yet.'}
                        </p>
                        {!search && !bgFilter && (
                          <Link to="/register" className="btn btn-danger btn-sm">
                            <i className="fas fa-user-plus me-2"></i>Register First Donor
                          </Link>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination ── */}
          {!loading && filtered.length > PAGE_SIZE && (
            <div className="manage-pagination">
              <span className="pagination-info">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>

              <div className="pagination-controls">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(1)}
                  disabled={safePage === 1}
                  title="First page"
                >
                  <i className="fas fa-angle-double-left"></i>
                </button>
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  title="Previous page"
                >
                  <i className="fas fa-angle-left"></i>
                </button>

                {pageRange().map(p => (
                  <button
                    key={p}
                    className={`page-btn ${p === safePage ? 'active' : ''}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                ))}

                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  title="Next page"
                >
                  <i className="fas fa-angle-right"></i>
                </button>
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={safePage === totalPages}
                  title="Last page"
                >
                  <i className="fas fa-angle-double-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Edit Modal ── */}
      {editDonor && (
        <EditModal
          donor={editDonor}
          onClose={() => setEditDonor(null)}
          onSaved={handleEditSaved}
        />
      )}

      {/* ── Delete Confirm Modal ── */}
      {deletingDonor && (
        <DeleteModal
          donor={deletingDonor}
          onClose={() => setDeletingDonor(null)}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
        />
      )}

    </div>
  );
};

export default ManageDonors;
