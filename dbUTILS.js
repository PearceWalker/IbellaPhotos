const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

const ENV = 'production'; // Change to 'production' as needed

const envFile = ENV === 'production' ? '.env.production' : '.env.dev';
dotenv.config({ path: envFile });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds

  keepAliveInitialDelay: 10000, // 10 seconds initial delay

});

async function retryQuery(query, params, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      console.error('Retrying query due to error:', error);
    }
  }
}

async function fetchFirstSixPhotosFromDatabase(galleryId) {
  const query = 'SELECT * FROM images WHERE gallery_id = ? LIMIT 15';
  return await retryQuery(query, [galleryId]);
}

async function fetchGalleriesFromDatabase() {
  let retries = 5;
  while (retries) {
      try {
          const [rows, fields] = await pool.query('SELECT * FROM galleries');
          return rows;
      } catch (err) {
          if (err.code === 'PROTOCOL_CONNECTION_LOST' && retries > 0) {
              console.error('Retrying database query...');
              retries--;
              await new Promise(res => setTimeout(res, 1000)); // Wait 1 second before retrying
          } else {
              console.error('Failed query attempt:', {
                  code: err.code,
                  errno: err.errno,
                  sqlState: err.sqlState,
                  sqlMessage: err.sqlMessage
              });
              throw err;
          }
      }
  }
  throw new Error('Failed to fetch galleries after multiple attempts');
}
async function fetchGalleryById(galleryId) {
  const query = 'SELECT * FROM galleries WHERE id = ?';
  const rows = await retryQuery(query, [galleryId]);
  return rows[0];
}

module.exports = {
  fetchGalleriesFromDatabase,
  fetchFirstSixPhotosFromDatabase,
  fetchGalleryById,
};

 