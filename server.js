/* ==========================================================
   server.js — Mhumsap Express Application Entry Point
   ========================================================== */

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const productRoutes = require('./server/routes/products');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ----------------------------------------------------------
   Middleware
   ---------------------------------------------------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ----------------------------------------------------------
   Serve static frontend files from /public
   ---------------------------------------------------------- */
app.use(express.static(path.join(__dirname, 'public')));

/* ----------------------------------------------------------
   API routes
   ---------------------------------------------------------- */
app.use('/api/products', productRoutes);

/* ----------------------------------------------------------
   Root redirect → home page
   ---------------------------------------------------------- */
app.get('/', (req, res) => {
  res.redirect('/pages/home.html');
});

/* ----------------------------------------------------------
   404 handler for unknown API routes
   ---------------------------------------------------------- */
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

/* ----------------------------------------------------------
   Global error handler
   ---------------------------------------------------------- */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/* ----------------------------------------------------------
   Start server
   ---------------------------------------------------------- */
app.listen(PORT, () => {
  console.log('');
  console.log('🍜  Mhumsap server is running!');
  console.log(`    Local:   http://localhost:${PORT}`);
  console.log(`    Pages:   http://localhost:${PORT}/pages/home.html`);
  console.log(`    API:     http://localhost:${PORT}/api/products`);
  console.log('');
  console.log('    Press Ctrl+C to stop.');
  console.log('');
});
