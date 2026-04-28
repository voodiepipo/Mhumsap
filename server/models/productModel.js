const db = require('../config/db');

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

async function findCategoryId(categoryName) {
  if (!categoryName) return null;
  const [rows] = await db.execute(
    'SELECT category_id FROM categories WHERE category_name = ?',
    [categoryName]
  );
  return rows[0]?.category_id ?? null;
}

const ProductModel = {

  getAll: async ({ search = '', category = '', stock = '', price = '' } = {}) => {
    let sql    = `SELECT ${SELECT_COLS} ${FROM_JOIN} WHERE 1=1`;
    const params = [];

    //filter by name
    if (search) {
      sql += ' AND (p.product_name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    //filter by  category
    if (category) {
      sql += ' AND c.category_name = ?';
      params.push(category);
    }

    //filter by avialibility
    if (stock) {
      if (stock === 'in_stock') {
        sql += ' AND p.stock > 0'; //<0
      } else if (stock === 'out_of_stock') {
        sql += ' AND p.stock = 0';
      }
    }

    //filter by price range
    if (price) {
      if (price === 'under_100') {
        sql += ' AND p.price < 100';
      } else if (price === '100_to_200') {
        sql += ' AND p.price BETWEEN 100 AND 200';
      } else if (price === 'over_200') {
        sql += ' AND p.price > 200';
      }
    }

    sql += ' ORDER BY p.created_at DESC';

    const [rows] = await db.execute(sql, params);
    return rows;
  },
  getById: async (id) => {
    const sql = `SELECT ${SELECT_COLS} ${FROM_JOIN} WHERE p.product_id = ?`;
    const [rows] = await db.execute(sql, [id]);
    return rows[0] || null;
  },

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
    return result.affectedRows; 
  },

  delete: async (id) => {
    const [result] = await db.execute(
      'DELETE FROM products WHERE product_id = ?',
      [id]
    );
    return result.affectedRows; 
  },
};

module.exports = ProductModel;
