const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.SERVER_PORT || 3002;
const apiToken = process.env.API_TOKEN;
const url = process.env.URL;

// Create an endpoint `/stores/` that fetches all Bilka stores from SallingGroups public stores API
// (To avoid having to handle pagination you can set a page size to 100).
// The API-key can be found in the top of the express server template.
// https://developer.sallinggroup.com/api-reference#apis-stores
app.get("/stores/", async (req, res) => {
  try {
    const data = await fetch(`${url}?&per_page=50&page_size=100`, {
      headers: {
        Authorization: `${apiToken}`,
      },
    });
    const stores = await data.json();
    const filteredJson = stores.map((store) => ({
      name: store.name,
      hours: store.hours.filter((hours) => hours.type === "store"),
    }));
    res.status(200).send(filteredJson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create an endpoint `/sorted-stores/` that sorts the stores based.
// (Could be alphabetically based on the name)
app.get("/stores/:storeId", async (req, res) => {
  try {
    const reqStore = req.params.storeId;
    const response = await fetch(`${url}/${reqStore}`, {
      headers: {
        accept: "application/json",
        Authorization: `${apiToken}`,
      },
    });
    const store = await response.json();
    const filteredJson = {
      name: store.name,
      hours: store.hours.filter((hours) => hours.type === "store"),
    };
    res.status(200).send([filteredJson]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create an endpoint `/stores/:storeId` that can fetch data for a single store.
// (The response should still be an array but just only contain one element)
app.get("/sorted-stores/", async (req, res) => {
  try {
    const response = await fetch(`${url}?&per_page=50&page_size=100`, {
      headers: {
        Authorization: `${apiToken}`,
      },
    });
    const stores = await response.json();
    const sortedStores = stores.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    const filteredJson = sortedStores.map((store) => ({
      name: store.name,
      hours: store.hours.filter((hours) => hours.type === "store"),
    }));
    res.status(200).send(filteredJson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create an endpoint `/find-nearby-stores/:distance`
// that can find stores nearby Salling Group headquarters (coordinates to use: 56.162387,10.0078135)
app.get("/find-nearby-stores/:distance", async (req, res) => {
  try {
    const reqDistance = req.params.distance;
    const response = await fetch(
      `${url}?geo=56.1623%2C10.0078&page=1&per_page=50&page_size=100&radius=${reqDistance}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `${apiToken}`,
        },
      }
    );
    const stores = await response.json();
    const filteredJson = stores.map((store) => ({
      name: store.name,
      hours: store.hours.filter((hours) => hours.type === "store"),
    }));
    res.status(200).send(filteredJson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
