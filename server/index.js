import express from "express";
import "dotenv/config";
import { axiosClient } from "./client.js";
import { PAGE_SIZE } from "./const/api.const.js";

const app = express();
const port = process.env.PORT;

//GET ALL 'Bilka' STORES
app.get("/stores", async (req, res) => {
  try {
    const response = await axiosClient.get("/v2/stores", {
      params: {
        brand: "bilka",
        fields: "name,hours",
        hourType: "store",
        per_page: PAGE_SIZE,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stores" });
  }
});

//GET SORTED STORE ALPHABETICALLY
app.get("/sorted-stores", async (req, res) => {
  try {
    const response = await axiosClient.get("/v2/stores", {
      params: {
        fields: "name,hours",
        hourType: "store",
        per_page: PAGE_SIZE,
      },
    });

    /* sort store aphabetically */
    const sortedStores = response.data.sort((x,y) => x.name.localeCompare(y.name)) ?? [];
    res.json(sortedStores);
  } catch(error) {
    res.status(500).json({error: "Failed to fetch stores"});
  }
});

//GET A SPECIFIC STORE BY 'STORE ID'
app.get("/stores/:storeId", async(req, res) => {
  try {
    const { storeId } = req.params;

    const response = await axiosClient.get(`/v2/stores/${storeId}`, {
      params: {
        fields: "name,hours",
        hourType: "store",
      },
    });

    res.json([response.data]);
  } catch(error) {
    res.status(500).json({error: "Failed to fetch stores"});
  }
});

//GET NEARBY STORES
app.get("/find-nearby-stores/:distance", async(req, res) => {
  try {
    const { distance } = req.params;

    const response = await axiosClient.get("/v2/stores", {
      params: {
        geo:"56.162387,10.0078135",
        fields: "name,hours",
        hourType: "store",
        radius: distance,
        per_page: PAGE_SIZE,
      },
    });

    res.json(response.data);
  } catch(error) {
    res.status(500).json({error: "Failed to fetch stores"});
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
