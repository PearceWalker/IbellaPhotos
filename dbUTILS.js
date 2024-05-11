const mysql = require('mysql2/promise');
const connection = mysql.createConnection({
    host: '127.0.0.1',  
    user: 'root',  
    password: '1311FhU6*',
    database: 'photo_gallery',
    port: '3306'
});
// Function to fetch the first five photos from the database for a given gallery ID
async function fetchFirstSixPhotosFromDatabase(connection, galleryId) {
    try {
      // Query to fetch the first five photos for the given gallery ID
      const [rows] = await connection.execute('SELECT * FROM images WHERE gallery_id = ? LIMIT 6', [galleryId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }


// Function to fetch galleries from the database
async function fetchGalleriesFromDatabase() {
  try {
      const connection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: '1311FhU6*',
          database: 'photo_gallery',
          port: '3306'
      });

      const [rows] = await connection.execute('SELECT * FROM galleries');
      await connection.end();

      return rows;
  } catch (error) {
      console.error('Error fetching galleries from the database:', error);
      throw error;
  }
}

async function fetchGalleryById(pool, galleryId) {
  try {
    const [rows] = await pool.execute('SELECT name FROM galleries WHERE id = ?', [galleryId]);
    return rows[0]; // Assuming there's only one row for the given galleryId
  } catch (error) {
    console.error('Error fetching gallery from the database:', error);
    throw error;
  }
}


module.exports = {
  fetchGalleriesFromDatabase,
  fetchFirstSixPhotosFromDatabase,
  fetchGalleryById
};
 