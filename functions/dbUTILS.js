const mysql = require('mysql2/promise');

// Create a pool of connections
const pool = mysql.createPool({
    host: 'monorail.proxy.rlwy.net',  
    user: 'root',  
    password: 'odfuyANXguisoUygwNVoomfJDWjBighP',
    database: 'photo_gallery',
    port: '54229',
    waitForConnections: true,
    connectionLimit: 10, // Adjust as needed
    queueLimit: 0 // Unlimited queueing
});

// Function to fetch the first six photos from the database for a given gallery ID
// Function to fetch the first six photos from the database for a given gallery ID
async function fetchFirstSixPhotosFromDatabase(pool, galleryId) {
  try {
      // Query to fetch the first six photos for the given gallery ID
      const [rows] = await pool.execute('SELECT * FROM images WHERE gallery_id = ? LIMIT 15', [galleryId]);
      return rows;
  } catch (error) {
      throw error;
  }
}

// Function to fetch galleries from the database
async function fetchGalleriesFromDatabase() {
    try {
        const [rows] = await pool.execute('SELECT * FROM galleries');
        return rows;
    } catch (error) {
        console.error('Error fetching galleries from the database:', error);
        throw error;
    }
}

// Function to fetch a gallery by ID from the database
async function fetchGalleryById(connection, galleryId) {
  try {
      // Query to fetch the gallery by ID
      const [rows] = await connection.execute('SELECT * FROM galleries WHERE id = ?', [galleryId]);
      return rows[0]; // Assuming there's only one row for the given galleryId
  } catch (error) {
      throw error;
  }
}


module.exports = {
    fetchGalleriesFromDatabase,
    fetchFirstSixPhotosFromDatabase,
    fetchGalleryById
};

 