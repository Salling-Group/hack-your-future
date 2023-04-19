const express = require('express');
const app = express();
const port = 3001;
const apiToken = "7c6108c9-20ae-496e-93b0-64242ee04c69";

// https://developer.sallinggroup.com/api-reference#apis-stores
//-------------------------------------------------------------------------# Task one:
app.get('/stores/', async (req, res) => {
  try {
    const response = await fetch("https://api.sallinggroup.com/v2/stores", {
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    });

    if (!response.ok){
      res.status(404).json({message: 'Not Found'});
    }
    const data = await response.json();
    const stores = data.map(element => {
      return  {
        name: element.name,
        hours: element.hours
      }
   })
    res.json(stores); 
    
  }
  catch (error) {
    res.status(500).json({message: 'Internal Server Error'});
  }
});


//------------------------------------------------------------------------# Task two:
app.get('/sorted-stores/', async (req, res) => {
  try {
    const response = await fetch("https://api.sallinggroup.com/v2/stores", {
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    });

    if (!response.ok){
      res.status(404).json({message: 'Not Found'});
    }
    const data = await response.json();
    const sortedStores = data.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    const stores = sortedStores.map(element => {
      return  {
        name: element.name,
        hours: element.hours
      }
   })
    res.json(stores); 
  }
  catch (error) {
    res.status(500).json({message: 'Internal Server Error'});
  }
});


//---------------------------------------------------------------------# Task three:
app.get('/stores/:storeId', async (req, res) => {
  try {
    const storeId = req.params.storeId;

    const response = await fetch(`https://api.sallinggroup.com/v2/stores/${storeId}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${apiToken}`
      }
    });

    if (!response.ok){
      res.status(404).json({message: 'Not Found'});
    }
    const data = await response.json();
    const stores = [data].map(element => {
      return  {
        name: element.name,
        hours: element.hours
      }
   })
    res.json(stores);     
  }
  catch (error) {
    res.status(500).json({message: 'Internal Server Error'});
  }
});


//----------------------------------------------------------------------------- # Task four:
app.get('/find-nearby-stores/:distance', async (req, res) => {
  try {
    const distance = req.params.distance;

    const response = await fetch(`https://api.sallinggroup.com/v2/stores?geo=56.162387%2C10.0078135&page=1&per_page=100&radius=${distance}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${apiToken}`
      }
    });

    if (!response.ok){
      res.status(404).json({message: 'Not Found'});
    }
    const data = await response.json();
    const stores = data.map(element => {
      return  {
        name: element.name,
        hours: element.hours
      }
   })
    res.json(stores); 
 
  }
  catch (error) {
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});