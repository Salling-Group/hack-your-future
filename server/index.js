/* server/index.js */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;
const BASE_URL = 'https://api.sallinggroup.com/';

// Allow calls from your frontend on localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Helper: authenticated Axios instance
function api() {
  const token = process.env.SG_TOKEN;
  if (!token) {
    throw new Error('Missing SG_TOKEN in environment');
  }
  console.log('shun',token)
  return axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * NEW: GET /stores/  (note the trailing slash per your requirement)
 * Fetch all Bilka stores, page size 100 to avoid pagination.
 */
app.get('/stores/', async (req, res) => {
  try {
    const params = {
      brand: 'bilka',
      pageSize: 100,
      // Optional: keep payload small by selecting fields
      // fields: 'id,name,brand,address,coordinates,hours'
    };

    const response = await api().get('/v2/stores', 
{
  headers: {
    Authorization: `Bearer ${process.env.SG_TOKEN}`
  },
 params });
    return res.status(200).json(response.data);
  } catch (err) {
    return handleError(err, res);
  }
});

// ---- Existing proxy endpoints (kept and cleaned) ----

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

/**
 * GET /stores
 * Proxy to Salling Group: GET /v2/stores
 * Supports fields, hourType, brand, lat, lon, radius
 */
app.get('/stores', async (req, res) => {
  try {
    const { fields, hourType, brand, lat, lon, radius } = req.query;
    const params = {};

    if (fields) params.fields = fields;        // e.g. id,name,brand,address,hours
    if (hourType) params.hourType = hourType;  // e.g. store, bakery, garden
    if (brand) params.brand = brand;           // e.g. netto, foetex, bilka
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
      if (radius) params.radius = radius;      // in km
    }

    const response = await api().get('/v2/stores', { params });
    res.json(response.data);
  } catch (err) {
    handleError(err, res);
  }
});

/**
 * GET /stores/:id
 * Proxy to Salling Group: GET /v2/stores/{id}
 */
app.get('/stores/:id', async (req, res) => {
  try {
    const response = await api().get(`/v2/stores/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    handleError(err, res);
  }
});

/**
 * GET /stores/:id/schedules
 * Proxy to Salling Group: GET /v2/stores/{id}/schedules
 */
app.get('/stores/:id/schedules', async (req, res) => {
  try {
    const response = await api().get(`/v2/stores/${req.params.id}/schedules`);
    res.json(response.data);
  } catch (err) {
    handleError(err, res);
  }
});

// Centralized error mapping
function handleError(err, res) {
  if (err.response) {
    return res.status(err.response.status).send(err.response.data);
  }
  return res.status(500).json({ error: err.message || 'Unknown error' });
}

app.listen(PORT, () => {
  console.log(`Express server listening on http://localhost:${PORT}`);
});
``