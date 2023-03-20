const express = require('express');
const app = express();
const port = 3001;
const apiToken = "7c6108c9-20ae-496e-93b0-64242ee04c69";


function mapResult(result) {
  return result.map(store => ({
    name: store.name,
    hours: store.hours.filter(hour => hour.type === 'store')
  }))
}

// name
// sapSiteId
// Opening hours - filtered on type 'store'

// https://developer.sallinggroup.com/api-reference#apis-stores
app.get('/stores/', async (req, res) => {
  const stores = await fetch("https://api.sallinggroup.com/v2/stores?brand=bilka&per_page=100", {
    headers: {
      Authorization: `Bearer ${apiToken}`
    }
  });
  const json = await stores.json();
  res.send(mapResult(json));
});

app.get('/sorted-stores/', async (req, res) => {
  const stores = await fetch("https://api.sallinggroup.com/v2/stores?brand=bilka&per_page=100", {
    headers: {
      Authorization: `Bearer ${apiToken}`
    }
  });
  const json = await stores.json();
  if (!json) res.send("Could not find stores");

  const sorted = json.sort((a,b) => a.name.localeCompare(b.name));
  res.send(mapResult(json));
});

app.get('/stores/:storeId', async (req, res) => {
  const storeId = req.params.storeId;
  const stores = await fetch(`https://api.sallinggroup.com/v2/stores/${storeId}?brand=bilka&per_page=100`, {
    headers: {
      Authorization: `Bearer ${apiToken}`
    }
  });
  const json = await stores.json();

  res.send(mapResult([json]));
});

app.get('/find-nearby-stores/:distance', async (req, res) => {
  const distance = req.params.distance;
  const stores = await fetch(`https://api.sallinggroup.com/v2/stores?brand=bilka&per_page=100&geo=56.162387,10.0078135&radius=${distance}`, {
    headers: {
      Authorization: `Bearer ${apiToken}`
    }
  });
  const json = await stores.json();

  res.send(mapResult(json));
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});