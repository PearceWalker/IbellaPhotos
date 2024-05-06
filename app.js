const express = require('express');
const app = express();
const PORT = 3000;

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dyam4n6rx',
  api_key: '125485311227336',
  api_secret: 'zinrYAssjZ_Htef49Di7ptcAzKY'
});


// Set the view engine to EJS
app.set('view engine', 'ejs');

// Define route handlers

// Route to handle GET requests to /gallery
app.get('/gallery', (req, res) => {
    const galleryId = req.query.id;
    console.log('Received request for gallery with ID:', galleryId);
    res.render('gallery_view', { galleryId });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
