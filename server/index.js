const express = require('express');
require('dotenv').config();
const app = express();
const port = 3001;
const apiToken = process.env.API_TOKEN;
const apiUrl = process.env.API_URL;

const headers = {
    'accept': 'application/json',
    'Authorization': `Bearer ${apiToken}`
}

function filterAndMapData(data) {
    let newArray = data
        .filter(obj => obj.hours.some(g => g.type === 'store'))
        .map(obj => ({ name: obj.name, hours: obj.hours }));

    return newArray;
}


// https://developer.sallinggroup.com/api-reference#apis-stores
// Task one: Create an endpoint /stores/
app.get('/stores/', async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 100;
        const stores = await fetch(`${apiUrl}?page=${page}&pageSize=${pageSize}`, { headers });

        if (!stores.ok) {
            res.status(404).json({ message: 'Data not available' });
        }
        const storesData = await stores.json();

        let modifiedStoresData = filterAndMapData(storesData);
        res.json(modifiedStoresData);

    } catch (error) {
        res.status(500).send(error);
    }
});


// Task two: Create an endpoint /sorted-stores/
app.get('/sorted-stores/', async (req, res) => {
    try {
        const results = await fetch(`${apiUrl}`, { headers });

        const data = await results.json();

        const sortedStores = data.sort(function (a, b) {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();

            return nameA.localeCompare(nameB);
        });

        let modifiedSortedStores = filterAndMapData(sortedStores);
        res.send(modifiedSortedStores);

    } catch (error) {
        res.status(500).send({ message: error });
    }
})


// Task three: Create an endpoint /stores/:storeId
app.get('/stores/:storeId', async (req, res) => {
    try {
        const id = req.params.storeId;

        const searchedStore = await fetch(`${apiUrl}/${id}`, { headers });

        const storesData = await searchedStore.json();

        let modifiedStoreData = filterAndMapData([storesData]);
        res.json(modifiedStoreData);

    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
});


// Task four: Create an endpoint /find-nearby-stores/:distance
app.get('/find-nearby-stores/:distance', async (req, res) => {
    try {
        const geo = encodeURIComponent('56.162387,10.0078135');
        const distance = req.params.distance;

        const stores = await fetch(`${apiUrl}?geo=${geo}&distance=${distance}`, { headers });

        const storeList = await stores.json();

        let modifiedStoreList = filterAndMapData(storeList);
        res.json(modifiedStoreList);

    } catch (error) {
        res.status(500).send({ message: error });
    }

});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

