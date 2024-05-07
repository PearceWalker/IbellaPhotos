require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
const upload = require('./multer');
const connections = require('./db');
const cloudinary = require('cloudinary').v2;
const dbUtils = require('./dbUTILS');
const mysql = require('mysql2/promise');


app.set('view engine', 'ejs');

const pool = mysql.createPool({
    host: '127.0.0.1',  
    user: 'root',  
    password: '1311FhU6*',
    database: 'photo_gallery',
    port: '3306'
});

app.get('/gallery', async (req, res) => {
    try {
      const galleryId = req.query.id;
      console.log('Received request for gallery with ID:', galleryId);
      const photos = await dbUtils.fetchFirstSixPhotosFromDatabase(pool, galleryId);
      console.log('Fetched photos:', photos);
      // Render your page with the fetched photos
      res.render('gallery_view', { galleryId, photos });
    } catch (error) {
      console.error('Error handling gallery request:', error);
      // Handle errors appropriately
      res.status(500).send('Internal Server Error');
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
