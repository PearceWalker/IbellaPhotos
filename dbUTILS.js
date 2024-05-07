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
  
  module.exports = {
    fetchFirstSixPhotosFromDatabase
  };
