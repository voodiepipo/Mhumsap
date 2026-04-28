const ProductModel = require('../models/productModel');

const ProductController = {

  /* GET */
  getAll: async (req, res) => {
    try {
      //stock  price filter
      const { search = '', category = '', stock = '', price = '' } = req.query;
      
      //sent data to Model create sql cmd
      const products = await ProductModel.getAll({ search, category, stock, price });
      
      res.json(products);
    } catch (err) {
      console.error('getAll error:', err.message);
      res.status(500).json({ error: 'Failed to retrieve products' });
    }
  },

  /* GET */
  getById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      const product = await ProductModel.getById(id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (err) {
      console.error('getById error:', err.message);
      res.status(500).json({ error: 'Failed to retrieve product' });
    }
  },

  /* POST */
  create: async (req, res) => {
    try {
      const { name, price, category, image_url, description, stock, rating } = req.body;

      if (!name || name.trim() === '')
        return res.status(400).json({ error: 'Name is required' });
      if (price === undefined || price === null || isNaN(parseFloat(price)))
        return res.status(400).json({ error: 'Price must be a valid number' });
      if (parseFloat(price) < 0)
        return res.status(400).json({ error: 'Price cannot be negative' });
      if (stock !== undefined && stock !== '' && (isNaN(parseInt(stock)) || parseInt(stock) < 0))
        return res.status(400).json({ error: 'Stock must be a non-negative integer' });
      if (rating !== undefined && rating !== '' && (isNaN(parseFloat(rating)) || parseFloat(rating) < 0 || parseFloat(rating) > 5))
        return res.status(400).json({ error: 'Rating must be between 0 and 5' });

      const insertId = await ProductModel.create({
        name: name.trim(), price, category, image_url, description, stock, rating,
      });

      const product = await ProductModel.getById(insertId);
      res.status(201).json(product);
    } catch (err) {
      console.error('create error:', err.message);
      res.status(500).json({ error: 'Failed to create product' });
    }
  },

  /* PUT */
  update: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid product ID' });

      const { name, price, category, image_url, description, stock, rating } = req.body;

      if (!name || name.trim() === '')
        return res.status(400).json({ error: 'Name is required' });
      if (price === undefined || price === null || isNaN(parseFloat(price)))
        return res.status(400).json({ error: 'Price must be a valid number' });
      if (parseFloat(price) < 0)
        return res.status(400).json({ error: 'Price cannot be negative' });
      if (stock !== undefined && stock !== '' && (isNaN(parseInt(stock)) || parseInt(stock) < 0))
        return res.status(400).json({ error: 'Stock must be a non-negative integer' });
      if (rating !== undefined && rating !== '' && (isNaN(parseFloat(rating)) || parseFloat(rating) < 0 || parseFloat(rating) > 5))
        return res.status(400).json({ error: 'Rating must be between 0 and 5' });

      const affected = await ProductModel.update(id, {
        name: name.trim(), price, category, image_url, description, stock, rating,
      });

      if (affected === 0) return res.status(404).json({ error: 'Product not found' });

      const product = await ProductModel.getById(id);
      res.json(product);
    } catch (err) {
      console.error('update error:', err.message);
      res.status(500).json({ error: 'Failed to update product' });
    }
  },

  /* DELETE */
  delete: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid product ID' });

      const affected = await ProductModel.delete(id);
      if (affected === 0) return res.status(404).json({ error: 'Product not found' });

      res.json({ message: 'Product deleted successfully', id });
    } catch (err) {
      console.error('delete error:', err.message);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  },
};

module.exports = ProductController;
