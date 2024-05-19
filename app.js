
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const upload = require('./multer');
const connections = require('./functions/db');
const cloudinary = require('cloudinary').v2;
const dbUtils = require('./dbUTILS');
const mysql = require('mysql2/promise');
const path = require('path');

app.use(express.static('dist'));
app.set('view engine', 'ejs');

const allowedOrigins = ['https://ibellaphoto.netlify.app/'];

app.use(cors({
  origin: allowedOrigins
}));



const pool = mysql.createPool({
    host: 'monorail.proxy.rlwy.net',  
    user: 'root',  
    password: 'odfuyANXguisoUygwNVoomfJDWjBighP',
    database: 'photo_gallery',
    port: '54229',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/gallery', async (req, res) => {
    try {
        const galleryId = req.query.id;
        console.log('Received request for gallery with ID:', galleryId);

       
        const photos = await dbUtils.fetchFirstSixPhotosFromDatabase(pool, galleryId);
        console.log('Fetched photos:', photos);

        const gallery = await dbUtils.fetchGalleryById(pool, galleryId);
        console.log('Fetched Gallery:', gallery);
     
        res.render('gallery_view', { gallery, photos });
    } catch (error) {
        console.error('Error handling gallery request:', error);
        // Handle errors appropriately
        res.status(500).send('Internal Server Error');
    }
});

app.get('/galleries', async (req, res) => {
  try {
      // Fetch galleries from the database
      const galleries = await dbUtils.fetchGalleriesFromDatabase();

      // Render the galleries page and pass the fetched galleries to the view
      res.render('gallery', { galleries });
  } catch (error) {
      console.error('Error fetching galleries:', error);
      // Handle errors appropriately
      res.status(500).send('Internal Server Error');
  }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
