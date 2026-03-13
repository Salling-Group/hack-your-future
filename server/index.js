import express from "express";
import "dotenv/config";
import axios from "axios";
 
const PORT = 3001;
const SG_API_TOKEN = 'SG_APIM_F7HPJKZCXZJGX5PAV1Z093S2SWCBMKSYY6AAKZTZ25WJPA3BKWNG';
const TOTAL_PAGE = 100;
const baseURL = process.env.API_BASE_URL;

const app = express();
 
 
app.get("/stores/", async (req, res) => {
  try {
    const response = await axios.get(`${baseURL}/v2/stores`, {
      params: {
        per_page: TOTAL_PAGE,
        fields: "id,name,brand,address,location,hours",
      },
       headers: {
        Authorization: `Bearer ${SG_API_TOKEN}`,
        Accept: "application/json",
      },
    });
 
    const list = Array.isArray(response.data)
      ? response.data
      : response.data?.items || response.data?.results || [];
 
    const bilkaStores = list?.filter(
      (s) => (s.brand || "").toLowerCase() === "bilka"
    );
 
    res.json(bilkaStores);
  } catch (error) {
       console.error('Error /stores:', error.message);
    res.json([]);
  }
});
function normalizeHours(s) {
  if (Array.isArray(s?.hours)) return s.hours;
  if (Array.isArray(s?.hours?.store)) return s.hours.store;
  return [];
}
app.get("/sorted-stores/", async (req, res) => {
  try {
    const { brand, per_page } = req.query;
 
    const response = await axios.get(`${baseURL}/v2/stores`, {
      params: {
        per_page: Number(per_page) || TOTAL_PAGE,
        fields: "id,name,brand,address,location,hours",
      },
       headers: {
        Authorization: `Bearer ${SG_API_TOKEN}`,
        Accept: "application/json",
      },
    });
 
    const list = Array.isArray(response.data)
      ? response.data
      : response.data?.items || response.data?.results || [];
 
    const filtered = brand
      ? list.filter(
        (s) => (s.brand || "").toLowerCase() === String(brand).toLowerCase()
      )
      : list;
 
    filtered.sort((a, b) =>
      (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" })
    );
    const normalized = filtered.map((s) => ({
      ...s,
      hours: normalizeHours(s),
    }));
 
    res.json(normalized);
  } catch (error){
    console.error('Error /sorted-stores:', error.message);
    res.json([]);
  }
});
 
app.get("/stores/:storeId", async (req, res) => {
  try {
    const { storeId } = req.params;
    const response = await axios.get(`${baseURL}/v2/stores/${storeId}`, {
      params: {
        fields: "id,name,brand,address,location,hours",
      },
       headers: {
        Authorization: `Bearer ${SG_API_TOKEN}`,
        Accept: "application/json",
      },
    });
 
    const store = response.data || null;
   if (!store?.id) {
      return res.json([]);
    }
    res.json([store]);
  } catch (error) {
    console.error("Error /stores/:storeId:", error.message);
    res.json([]);
  }
});
 
app.get("/find-nearby-stores/:distance", async (req, res) => {
  try {
    const { area } = req.params;
 
    const response = await axios.get(`${baseURL}/v2/stores`, {
      params: {
        geo: "56.162387,10.0078135",
        fields: "name,hours,address,location,brand",
        radius: area,
        per_page: TOTAL_PAGE,
      },
       headers: {
        Authorization: `Bearer ${SG_API_TOKEN}`,
        Accept: "application/json",
      },
    });
 
    res.json(response.data);
  } catch (error) {
    console.error("Error /find-nearby-stores:", error.message);
    res.json([]);
  }
});
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});