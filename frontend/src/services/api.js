/**
 * Axios API service layer for Blood Donation Management System.
 *
 * All HTTP communication with the Django REST API goes through this file.
 * The proxy in package.json routes /api/* to http://localhost:8000.
 *
 * Donor Endpoints:
 *   GET    /api/donors/           - list / search donors
 *   POST   /api/donors/           - register a new donor
 *   GET    /api/donors/:id/       - get a single donor
 *   PUT    /api/donors/:id/       - full update
 *   PATCH  /api/donors/:id/       - partial update
 *   DELETE /api/donors/:id/       - delete
 *
 * Blood Request Endpoints:
 *   GET    /api/blood-requests/   - list requests
 *   POST   /api/blood-requests/   - submit a request
 *   GET    /api/blood-requests/:id/
 *   DELETE /api/blood-requests/:id/
 */

import axios from 'axios';

// ---------------------------------------------------------------------------
// Axios instance — base URL points to Django backend via CRA proxy
// ---------------------------------------------------------------------------
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// ---------------------------------------------------------------------------
// Request interceptor — attach auth token if present (future-proofing)
// ---------------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    // If a token is stored, attach it
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response interceptor — normalise errors into readable messages
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a non-2xx status
      const { data, status } = error.response;
      const message =
        data?.message ||
        data?.detail ||
        `Server error (${status})`;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(
        new Error('No response from server. Please check your connection.')
      );
    }
    return Promise.reject(error);
  }
);

// ===========================================================================
// DONOR API
// ===========================================================================

/**
 * Fetch all donors.
 * @param {object} params  - Optional query params: { blood_group, city, search }
 * @returns {Promise<Array>} Array of donor objects
 */
export const getDonors = async (params = {}) => {
  const response = await api.get('/donors/', { params });
  return response.data; // { success, count, donors }
};

/**
 * Fetch a single donor by ID.
 * @param {number} id
 */
export const getDonorById = async (id) => {
  const response = await api.get(`/donors/${id}/`);
  return response.data; // { success, donor }
};

/**
 * Register a new donor.
 * @param {object} donorData  - Form data matching the Donor model
 */
export const createDonor = async (donorData) => {
  const response = await api.post('/donors/', donorData);
  return response.data; // { success, message, donor }
};

/**
 * Fully update a donor record.
 * @param {number} id
 * @param {object} donorData
 */
export const updateDonor = async (id, donorData) => {
  const response = await api.put(`/donors/${id}/`, donorData);
  return response.data; // { success, message, donor }
};

/**
 * Partially update a donor record.
 * @param {number} id
 * @param {object} partialData
 */
export const patchDonor = async (id, partialData) => {
  const response = await api.patch(`/donors/${id}/`, partialData);
  return response.data;
};

/**
 * Delete a donor by ID.
 * @param {number} id
 */
export const deleteDonor = async (id) => {
  const response = await api.delete(`/donors/${id}/`);
  return response.data; // { success, message }
};

// ===========================================================================
// BLOOD REQUEST API
// ===========================================================================

/**
 * Fetch all blood requests.
 * @param {object} params  - Optional query params: { blood_group, city, status, search }
 */
export const getBloodRequests = async (params = {}) => {
  const response = await api.get('/blood-requests/', { params });
  return response.data; // { success, count, requests }
};

/**
 * Fetch a single blood request by ID.
 * @param {number} id
 */
export const getBloodRequestById = async (id) => {
  const response = await api.get(`/blood-requests/${id}/`);
  return response.data;
};

/**
 * Submit a new blood request.
 * @param {object} requestData  - Form data matching the BloodRequest model
 */
export const createBloodRequest = async (requestData) => {
  const response = await api.post('/blood-requests/', requestData);
  return response.data; // { success, message, request }
};

/**
 * Delete a blood request by ID.
 * @param {number} id
 */
export const deleteBloodRequest = async (id) => {
  const response = await api.delete(`/blood-requests/${id}/`);
  return response.data;
};

export default api;
