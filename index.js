const express = require('express');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;
const baseUrl = 'https://your-vercel-url.com'; // replace with your vercel deployment url
const urlDatabase = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the home page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>URL Shortener</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        form {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        input {
          margin: 10px;
          padding: 10px;
          font-size: 16px;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <h1>URL Shortener</h1>
      <form id="shortenForm">
        <input type="url" name="url" placeholder="Enter URL to shorten" required>
        <button type="submit">Shorten URL</button>
      </form>
      <p id="result"></p>

      <script>
        document.getElementById('shortenForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const url = e.target.url.value;
          const response = await fetch('/shorten', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
          });
          const result = await response.json(); // Parse response as JSON
          document.getElementById('result').textContent = \`Shortened URL: \${result.shortUrl}\`;
        });
      </script>
    </body>
    </html>
  `);
});

// Handle URL shortening
app.post('/shorten', (req, res) => {
  const originalUrl = req.body.url;
  const urlId = crypto.randomBytes(4).toString('hex');
  urlDatabase[urlId] = originalUrl;
  res.json({ shortUrl: `${baseUrl}/${urlId}` });
});

// Redirect shortened URLs
app.get('/:urlId', (req, res) => {
  const urlId = req.params.urlId;
  const originalUrl = urlDatabase[urlId];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
