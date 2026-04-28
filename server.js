require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const productRoutes = require('./server/routes/products');
const db = require('./server/config/db'); 

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes for product
app.use('/api/products', productRoutes);

/* ==========================================================
   API for Login call first name
   ========================================================== */
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    //use join to get first name
    const [rows] = await db.query(
      `SELECT al.role, a.first_name 
       FROM admin_login al 
       JOIN administrators a ON al.admin_id = a.admin_id 
       WHERE al.username = ? AND al.password_hash = ?`,
      [username, password]
    );
    
    if (rows.length > 0) {
      res.json({ 
        success: true, 
        role: rows[0].role, 
        firstName: rows[0].first_name // sent firstname to frontend
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: 'Database error occurred.' });
  }
});

/* ==========================================================
   API for Signup 
   ========================================================== */
app.post('/api/auth/signup', async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;
  
  try {
    //to table administrators
    const [adminResult] = await db.query(
      'INSERT INTO administrators (first_name, last_name, email) VALUES (?, ?, ?)',
      [firstName, lastName, email]
    );
    
    const newAdminId = adminResult.insertId;
    
    //to table admin_login 
    await db.query(
      'INSERT INTO admin_login (admin_id, username, password_hash, role) VALUES (?, ?, ?, ?)',
      [newAdminId, username, password, 'admin']
    );
    
    res.json({ success: true, message: 'Account created successfully!' });
  } catch (err) {
    console.error('Signup Error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Username or Email already exists.' });
    }
    res.status(500).json({ success: false, message: 'Database error occurred.' });
  }
});

//after login to home.html
app.get('/', (req, res) => {
  res.redirect('/pages/home.html');
});

app.listen(PORT, '0.0.0.0' ,() => {
  console.log(`\n    Mhumsap Server is Running!`);
  console.log(`    URL: http://localhost:${PORT}/pages/home.html\n`);
});