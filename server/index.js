import express from 'express';
import 'dotenv/config';
import axios from 'axios';
import cors from 'cors';
import morgan from 'morgan';

// --- Config ---
const PORT = Number(process.env.PORT || 3001);
const API_BASE_URL = process.env.API_BASE_URL;
const SG_API_TOKEN = process.env.SG_API_TOKEN; 
const TOTAL_PAGE = Number(process.env.TOTAL_PAGE || 100);
const DEFAULT_GEO = process.env.DEFAULT_GEO || '56.162387,10.0078135';

if (!API_BASE_URL || !SG_API_TOKEN) {
  process.exit(1);
}

// --- Axios client ---
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${SG_API_TOKEN}`,
    Accept: 'application/json',
  },
});

// --- Helpers ---
function extractList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function processWorkHours(store) {
  if (Array.isArray(store?.hours)) return store.hours;
  if (Array.isArray(store?.hours?.store)) return store.hours.store;
  return [];
}

// --- App setup ---
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// --- Routes ---

// 1) GET /stores/ -> Only Bilka stores
app.get('/stores/', async (req, res) => {
  try {
    const resp = await api.get('/v2/stores', {
      params: {
        per_page: TOTAL_PAGE,
        fields: 'id,name,brand,address,location,hours',
      },
    });

    const list = extractList(resp.data);
    const bilkaStores = list.filter(
      (s) => String(s?.brand || '').toLowerCase() === 'bilka'
    );

    return res.json(bilkaStores);
  } catch (error) {
    console.error('Error /stores:', error.message);
    return res.json([]);
  }
});

// 2) GET /sorted-stores/?brand=&per_page=
//    -> filters by brand (optional), sorts by name asc, normalizes hours
app.get('/sorted-stores/', async (req, res) => {
  try {
    const { brand, per_page } = req.query;
    const pageSize = Number(per_page) || TOTAL_PAGE;

    const resp = await api.get('/v2/stores', {
      params: {
        per_page: pageSize,
        fields: 'id,name,brand,address,location,hours',
      },
    });

    const list = extractList(resp.data);

    const filtered = brand
      ? list.filter(
          (s) =>
            String(s?.brand || '').toLowerCase() ===
            String(brand || '').toLowerCase()
        )
      : list;

    filtered.sort((a, b) =>
      String(a?.name || '').localeCompare(String(b?.name || ''), undefined, {
        sensitivity: 'base',
      })
    );

    const normalized = filtered.map((s) => ({
      ...s,
      hours: processWorkHours(s),
    }));

    return res.json(normalized);
  } catch (error) {
    console.error('Error /sorted-stores:', error.message);
    return res.json([]);
  }
});

// 3) GET /stores/:storeId -> Return [store] or []
app.get('/stores/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;

    const resp = await api.get(`/v2/stores/${storeId}`, {
      params: { fields: 'id,name,brand,address,location,hours' },
    });

    const store = resp.data || null;
    if (!store?.id) return res.json([]);
    return res.json([store]);
  } catch (error) {
    console.error('Error /stores/:storeId:', error.message);
    return res.json([]);
  }
});

// 4) GET /find-nearby-stores/:distance?geo=lat,lng
//    -> returns upstream body or [] on error
app.get('/find-nearby-stores/:distance', async (req, res) => {
  try {
    const { distance } = req.params; // fixed from 'area'
    const { geo = DEFAULT_GEO } = req.query;

    const resp = await api.get('/v2/stores', {
      params: {
        geo, // "lat,lng"
        radius: distance, // units depend on upstream API
        per_page: TOTAL_PAGE,
        fields: 'name,hours,address,location,brand',
      },
    });

    return res.json(resp.data);
  } catch (error) {
    console.error('Error /find-nearby-stores:', error.message);
    return res.json([]);
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`✅ Listening on http://localhost:${PORT}`);
});