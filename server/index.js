import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const TOKEN = process.env.SG_API_TOKEN;
const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT || 3001;

const COMMON_QUERY = Object.freeze({
  brand: "bilka",
  hourType: "store",
  fields: "id,name,hours",
  per_page: "100",
});

// GET helper
async function sgGet(path, query = {}) {
  const url = new URL(BASE_URL + { path });
  Object.entries(query).forEach(
    ([k, v]) => v != null && url.searchParams.set(k, v)
  );

  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/json" },
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    const err = new Error(text || resp.statusText);
    err.status = resp.status;
    throw err;
  }
  return resp.json();
}

const clean = (s) => ({
  id: s.id,
  name: s.name,
  hours: Array.isArray(s.hours)
    ? s.hours.filter((h) => h.type === "store")
    : [],
});

// Task 1 : fetches all Bilka stores
app.get("/stores/", async (res, next) => {
  try {
    const list = await sgGet("/v2/stores", {
      ...COMMON_QUERY,
    });
    res.json(list.map(clean));
  } catch (e) {
    next(e);
  }
});

// Task 2 : sorts the stores
app.get("/sorted-stores/", async (res, next) => {
  try {
    const list = await sgGet("/v2/stores", {
      ...COMMON_QUERY,
    });
    res.json(
      list
        .map(clean)
        .sort((a, b) => (a?.name ?? "").localeCompare(b?.name ?? ""))
    );
  } catch (e) {
    next(e);
  }
});

// Task 3 : fetch data for a single store.
app.get("/stores/:id", async (req, res, next) => {
  try {
    const s = await sgGet(`/v2/stores/${req.params.id}`, {
      ...COMMON_QUERY,
    });
    res.json([clean(s)]);
  } catch (e) {
    if (e.status === 404) return res.json([]);
    next(e);
  }
});

// Task 4 : find stores nearby
app.get("/find-nearby-stores/:km", async (req, res, next) => {
  try {
    const km = Number(req.params.km);
    const lat = req.params.lat,
      lon = req.params.lon;
    const list = await sgGet("/v2/stores", {
      geo: `${lat},${lon}`,
      radius: String(km),
      ...COMMON_QUERY,
    });
    res.json(list.map(clean));
  } catch (e) {
    next(e);
  }
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

// start
app.listen(PORT, () => console.log("Server running on", PORT));
