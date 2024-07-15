const express = require('express');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;
const baseUrl = 'https://tinylinker.vercel.app'; // replace with your vercel deployment url
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
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f0f0f0;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          text-align: center;
          background-color: #fff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 400px;
        }
        h1 {
          color: #333;
          margin-bottom: 20px;
        }
        form {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        input[type="url"] {
          width: 300px;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        button[type="submit"] {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
        button[type="submit"]:hover {
          background-color: #45a049;
        }
        p {
          margin-top: 20px;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>URL Shortener</h1>
        <form id="shortenForm">
          <input type="url" name="url" placeholder="Enter URL to shorten" required>
          <button type="submit">Shorten URL</button>
        </form>
        <p id="result"></p>
      </div>

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
