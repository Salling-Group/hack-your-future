const express = require('express');
const app = express();
const port = 3001;
const apiToken = "7c6108c9-20ae-496e-93b0-64242ee04c69";

// https://developer.sallinggroup.com/api-reference#apis-stores
app.get('/api/', async (req, res) => {
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});