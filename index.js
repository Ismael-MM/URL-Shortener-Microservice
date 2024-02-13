const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const Url = {};

app.post('/api/shorturl', (req, res) => {
    const { url } = req.body;
    
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    const shortUrl = Object.keys(Url).length + 1;
    Url[shortUrl] = url;

    res.json({ original_url: url, short_url: shortUrl });
});

app.get('/api/shorturl/:short_url', (req, res) => {
    const { short_url } = req.params;
    const originalUrl = Url[short_url];
    
    if (!originalUrl) {
        return res.status(404).json({ error: 'Short URL not found' });
    }

    res.redirect(originalUrl);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
