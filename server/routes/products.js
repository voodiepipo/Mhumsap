/* ==========================================================
   server/routes/products.js — Express Router for Products
   Maps HTTP verbs + paths to controller methods.
   ========================================================== */

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/productController');

// GET    /api/products          → list all (with optional ?search= ?category=)
router.get('/',    controller.getAll);

// GET    /api/products/:id      → get one product by ID
router.get('/:id', controller.getById);

// POST   /api/products          → create a new product
router.post('/',   controller.create);

// PUT    /api/products/:id      → update an existing product
router.put('/:id', controller.update);

// DELETE /api/products/:id      → delete a product
router.delete('/:id', controller.delete);

module.exports = router;
