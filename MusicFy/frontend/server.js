const express = require('express');
const app = express();
const port = 5000;

// Simple static file server
app.use(express.static('src'));

// Send all routes to index.html
app.get('*', (req, res) => {
  res.sendFile('src/index.html', { root: __dirname });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Frontend server running on port ${port}`);
});