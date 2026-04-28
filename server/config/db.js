/* ==========================================================
   server/config/db.js — MySQL Connection Pool
   ========================================================== */

   const mysql = require('mysql2');

   const pool = mysql.createPool({
     host:             process.env.DB_HOST     || '127.0.0.1',
     port:             parseInt(process.env.DB_PORT) || 3306,
     user:             process.env.DB_USER     || 'root',
     password:         process.env.DB_PASSWORD || '',
     database:         process.env.DB_NAME     || 'mhumsap_db',
     waitForConnections: true,
     connectionLimit:  10,
     queueLimit:       0,
     charset:          'utf8mb4',
   });
   
   // Test the connection on startup
   pool.getConnection((err, connection) => {
     if (err) {
       console.error('    MySQL connection failed:', err.message);
       console.error('    Check your .env credentials and that MySQL is running.');
       return;
     }
     console.log('✅  MySQL connected: database =', process.env.DB_NAME || 'mhumsap_db');
     connection.release();
   });
   
   // Export promise-based interface for async/await
   module.exports = pool.promise();