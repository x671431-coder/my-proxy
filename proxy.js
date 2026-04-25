const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

app.get('/proxy', async (req, res) => {
  let target = req.query.q || req.query.url;
  if (!target) return res.status(400).send('No URL provided');

  if (!target.startsWith('http')) target = 'https://' + target;

  try {
    const response = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const content = await response.text();
    res.set('Content-Type', response.headers.get('content-type') || 'text/html');
    res.send(content);
  } catch (e) {
    res.status(502).send('Proxy error');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Unblock County running on port ${port}`));
