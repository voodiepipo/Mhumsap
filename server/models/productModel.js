/* ==========================================================
   server/models/productModel.js
   
   DB column names:  product_id, product_name, category_id
   API response:     id,         name,         category      ← aliased in SQL
   
   The SELECT aliases mean the frontend JS (home.js, products.js,
   search.js, product-detail.js) needs ZERO changes — they still
   read p.id, p.name, p.category as always.
   ========================================================== */

const db = require('../config/db');

/* ----------------------------------------------------------
   Shared SELECT columns (used in getAll and getById)
   - Aliases real column names so the API response is stable
   ---------------------------------------------------------- */
const SELECT_COLS = `
  p.product_id    AS id,
  p.product_name  AS name,
  c.category_name AS category,
  p.category_id,
  p.description,
  p.price,
  p.stock,
  p.rating,
  p.image_url,
  p.created_at
`;

const FROM_JOIN = `
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.category_id
`;

/* ----------------------------------------------------------
   Helper: look up category_id given a category name string
   Returns the matching category_id, or null if not found.
   ---------------------------------------------------------- */
async function findCategoryId(categoryName) {
  if (!categoryName) return null;
  const [rows] = await db.execute(
    'SELECT category_id FROM categories WHERE category_name = ?',
    [categoryName]
  );
  return rows[0]?.category_id ?? null;
}

/* ----------------------------------------------------------
   Model exports
   ---------------------------------------------------------- */
const ProductModel = {

  /* --------------------------------------------------------
     GET ALL
     Supports: ?search=keyword  and  ?category=Thai
     -------------------------------------------------------- */
  getAll: async ({ search = '', category = '' } = {}) => {
    let sql    = `SELECT ${SELECT_COLS} ${FROM_JOIN} WHERE 1=1`;
    const params = [];

    if (search) {
      sql += ' AND (p.product_name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      sql += ' AND c.category_name = ?';
      params.push(category);
    }

    sql += ' ORDER BY p.created_at DESC';

    const [rows] = await db.execute(sql, params);
    return rows;
  },

  /* --------------------------------------------------------
     GET ONE by id
     -------------------------------------------------------- */
  getById: async (id) => {
    const sql = `SELECT ${SELECT_COLS} ${FROM_JOIN} WHERE p.product_id = ?`;
    const [rows] = await db.execute(sql, [id]);
    return rows[0] || null;
  },

  /* --------------------------------------------------------
     CREATE
     Receives { name, price, category (text), image_url,
                description, stock, rating }
     Resolves category → category_id via categories table.
     -------------------------------------------------------- */
  create: async ({ name, price, category, image_url, description, stock, rating }) => {
    const categoryId = await findCategoryId(category);

    const [result] = await db.execute(
      `INSERT INTO products
         (product_name, price, category_id, image_url, description, stock, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        parseFloat(price),
        categoryId,
        image_url   || null,
        description || null,
        stock  !== undefined && stock  !== '' ? parseInt(stock)    : 0,
        rating !== undefined && rating !== '' ? parseFloat(rating) : null,
      ]
    );
    return result.insertId;
  },

  /* --------------------------------------------------------
     UPDATE
     -------------------------------------------------------- */
  update: async (id, { name, price, category, image_url, description, stock, rating }) => {
    const categoryId = await findCategoryId(category);

    const [result] = await db.execute(
      `UPDATE products
       SET product_name = ?,
           price        = ?,
           category_id  = ?,
           image_url    = ?,
           description  = ?,
           stock        = ?,
           rating       = ?
       WHERE product_id = ?`,
      [
        name,
        parseFloat(price),
        categoryId,
        image_url   || null,
        description || null,
        stock  !== undefined && stock  !== '' ? parseInt(stock)    : 0,
        rating !== undefined && rating !== '' ? parseFloat(rating) : null,
        id,
      ]
    );
    return result.affectedRows; // 1 if updated, 0 if not found
  },

  /* --------------------------------------------------------
     DELETE
     -------------------------------------------------------- */
  delete: async (id) => {
    const [result] = await db.execute(
      'DELETE FROM products WHERE product_id = ?',
      [id]
    );
    return result.affectedRows; // 1 if deleted, 0 if not found
  },
};

module.exports = ProductModel;
