const express = require('express')
const app = express()
const port = 3000
const apiToken = 'Bearer 7c6108c9-20ae-496e-93b0-64242ee04c69'
const API_URL = 'https://api.sallinggroup.com/v2/stores'

//# Task one:
app.get('/stores/', async (req, res) => {
  try {
    const data = await fetch(API_URL, {
      headers: {
        Authorization: `${apiToken}`,
        'Content-Type': 'application/jason',
      },
      params: {
        pageSize: 100,
      },
    })
    const stores = await data.json()

    res.json(stores)
  } catch (error) {
    console.log(error)
  }
})

//# Task two:

app.get('/sorted-stores/', async (req, res) => {
  try {
    const data = await fetch(API_URL, {
      headers: {
        Authorization: `${apiToken}`,
        'Content-Type': 'application/json',
      },
      params: {
        pageSize: 100,
      },
    })
    const stores = await data.json()
    // Sort the stores alphabetically based on the name
    const sortedStores = stores.sort(stores.name)
    // Extract only the names of the sorted stores
    const storeNames = sortedStores.map((store) => store.name)
    res.json(storeNames)
  } catch (error) {
    console.log(error)
  }
})

//# Task three:
app.get('/stores/storeId', async (req, res) => {
  try {
    const storeId = req.params.storeId

    const data = await fetch(`API_URL${storeId}`, {
      headers: {
        Authorization: `${apiToken}`,
        'Content-Type': 'application/json',
      },
      params: {
        pageSize: 100,
      },
    })
    const store = await data.json()

    res.json([store])
  } catch (error) {
    console.log(error)
  }
})

// # Task four:

app.get('/stores/storeId', async (req, res) => {
  try {
    const distance = req.params.distance
    const defaultCoordinates = [56.162387, 10.0078135]

    const data = await fetch(API_URL, {
      headers: {
        Authorization: `${apiToken}`,
        'Content-Type': 'application/json',
      },
      params: {
        pageSize: 100,
      },
    })
    const stores = await data.json()

    const neaStore = stores.filter((store) => {
      const storeCoordinates = [store.latitude, store.longitude]
      const distanceInKm = calculateDistance(
        defaultCoordinates,
        storeCoordinates
      )
      return distanceInKm <= distance
    })
    res.jason(neaStore)
  } catch (error) {
    console.log(error)
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
