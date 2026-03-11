const express = require('express');
const app = express();
const port = 3001;
const apiToken = 'SG_APIM_F7HPJKZCXZJGX5PAV1Z093S2SWCBMKSYY6AAKZTZ25WJPA3BKWNG';

// https://developer.sallinggroup.dev/apireference/stores
app.get('/stores/', async (req, res) => {});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
