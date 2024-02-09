require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const validUrl = require('valid-url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

let urlCount = 0;
const urlMap = new Map();

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.original_url;

  if (!validUrl.isUri(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(new URL(originalUrl).hostname, (err, address) => {
    if (err) {
      return res.status(500).json({ error: 'dns lookup failed' });
    }

    const shortUrl = ++urlCount;
    urlMap.set(shortUrl, originalUrl);

    res.json({ original_url: originalUrl, short_url: shortUrl });
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  if (urlMap.has(shortUrl)) {
    res.redirect(urlMap.get(shortUrl));
  } else {
    res.status(404).json({ error: 'short url not found' });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
