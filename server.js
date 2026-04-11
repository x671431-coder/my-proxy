const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/fetch', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('No URL provided');
  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      responseType: 'arraybuffer'
    });
    const contentType = response.headers['content-type'] || 'text/html';
    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.send(response.data);
  } catch (e) {
    res.status(500).send('Failed to fetch: ' + e.message);
  }
});

app.listen(3000, () => console.log('Proxy running on port 3000'));
