const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const serverApp = express();
const serverPort = process.env.PORT || 3001;
const sgApiToken = process.env.SG_TOKEN;

if (!sgApiToken) {
  process.exit(1);
}

const SG_API_BASE_URL = 'https://api.sallinggroup.com/v2/stores';

serverApp.use(cors());
serverApp.use(express.json());

// Fetch wrapper
async function fetchSGData(path = '', params = {}) {
  const queryString =
    Object.keys(params).length > 0
      ? `?${new URLSearchParams(params).toString()}`
      : '';

  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const requestUrl = `${SG_API_BASE_URL}${normalizedPath}${queryString}`;

  const controller = new AbortController();
  const timeoutHandler = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(requestUrl, {
      headers: {
        Authorization: `Bearer ${sgApiToken}`,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('SG API error', response.status, errorText);
      throw new Error(`SG API error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch failed for', requestUrl, '-', error.name, error.message);
    throw error;
  } finally {
    clearTimeout(timeoutHandler);
  }
}

// Store shaping
function normalizeStoreData(store) {
  return {
    id: store.id,
    name: store.name,
    brand: store.brand,
    coordinates: store.coordinates,
    hours: store.hours || [],
  };
}

// Distance calculation
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const EARTH_RADIUS_KM = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

serverApp.get('/stores/', async (req, res) => {
  try {
    const data = await fetchSGData('', { brand: 'bilka', size: 100 });
    const storeList = Array.isArray(data) ? data : data.items || [];

    const bilkaStores = storeList.filter(
      (store) => (store.brand || '').toLowerCase() === 'bilka'
    );

    res.json(bilkaStores.map(normalizeStoreData));
  } catch (error) {
    console.error('Error /stores:', error.message);
    res.status(502).json({ error: 'Upstream SG API failed', detail: error.message });
  }
});

serverApp.get('/sorted-stores/', async (req, res) => {
  try {
    const data = await fetchSGData('', { brand: 'bilka', size: 100 });
    const storeList = Array.isArray(data) ? data : data.items || [];

    const bilkaStores = storeList
      .filter((store) => (store.brand || '').toLowerCase() === 'bilka')
      .map(normalizeStoreData)
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json(bilkaStores);
  } catch (error) {
    console.error('Error /sorted-stores:', error.message);
    res.status(502).json({ error: 'Upstream SG API failed', detail: error.message });
  }
});

serverApp.get('/stores/:storeId', async (req, res) => {
  try {
    const store = await fetchSGData(`/${req.params.storeId}`);
    if (!store || !store.id) return res.json([]);
    res.json([normalizeStoreData(store)]);
  } catch (error) {
    if (String(error.message).includes('404')) return res.json([]);
    console.error('Error /stores/:storeId:', error.message);
    res.status(502).json({ error: 'Upstream SG API failed', detail: error.message });
  }
});

// HQ Coordinates
const companyHQCoordinates = { lat: 56.162387, lon: 10.0078135 };

serverApp.get('/find-nearby-stores/:distance', async (req, res) => {
  try {
    const distanceKm = Number(req.params.distance);
    if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
      return res.status(400).json({ error: 'Distance must be a positive number' });
    }

    const data = await fetchSGData('', { brand: 'bilka', size: 100 });
    const storeList = Array.isArray(data) ? data : data.items || [];

    const nearbyStoreResults = storeList
      .filter((store) => (store.brand || '').toLowerCase() === 'bilka')
      .map(normalizeStoreData)
      .map((store) => {
        const lat = store.coordinates?.lat ?? store.coordinates?.latitude;
        const lon = store.coordinates?.lon ?? store.coordinates?.longitude;

        const validCoordinates = typeof lat === 'number' && typeof lon === 'number';

        return {
          ...store,
          distanceKm: validCoordinates
            ? calculateDistanceKm(
                companyHQCoordinates.lat,
                companyHQCoordinates.lon,
                lat,
                lon
              )
            : Infinity,
        };
      })
      .filter((store) => store.distanceKm <= distanceKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json(nearbyStoreResults);
  } catch (error) {
    console.error('Error /find-nearby-stores/:distance:', error.message);
    res.status(502).json({ error: 'Upstream SG API failed', detail: error.message });
  }
});

serverApp.listen(serverPort, () => {
  console.log(`Listening on port ${serverPort}`);
});