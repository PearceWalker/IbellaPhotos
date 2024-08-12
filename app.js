const dotenv = require('dotenv');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const upload = require('./multer');
const connections = require('./db');
const cloudinary = require('cloudinary').v2;
const dbUtils = require('./dbUTILS');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');

app.use(express.static('dist'));
app.set('view engine', 'ejs');

const ENV = 'dev'; // Change to 'production' as needed

const envFile = ENV === 'production' ? '.env.production' : '.env.dev';
dotenv.config({ path: envFile });

const allowedOrigins = ['https://ibellaphoto.netlify.app/'];

app.use(cors({
  origin: allowedOrigins
}));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Define booking options
const bookingOptions = [
    {
        id: 1,
        name: 'Mini Session',
        price: 65,
        duration: '20 minutes of shooting time',
        details: ['One outfit, one location', '10 edited photos, plus b+w edits'],
        imageUrl: 'https://res.cloudinary.com/drtfqetrk/image/upload/v1722131006/sara%20sunset/ergsvalv4ymckztztops.jpg',
        dataPath: 'ibellaphotos/mini-session'
    },
    {
        id: 2,
        name: 'Session #1',
        price: 75,
        duration: '30 minutes of shooting time',
        details: ['One outfit, one location', '15 edited photos, plus b+w edits'],
        imageUrl: 'https://res.cloudinary.com/drtfqetrk/image/upload/v1722120724/farrah%2Bpablo/sqsm9jep3mtmqxz1yb2o.jpg',
        dataPath: 'ibellaphotos/session-1'
    },
    {
        id: 3,
        name: 'Session #2',
        price: 115,
        duration: '1 hour of shooting time',
        details: ['Up to 2 outfits, up to 2 locations', '25 edited photos, plus b+w edits'],
        imageUrl: 'https://res.cloudinary.com/drtfqetrk/image/upload/v1722130391/kayla%20summit%20grad%2024%E2%80%99/juhp6thsixxyua7lfuam.jpg',
        dataPath: 'ibellaphotos/session-2'
    },
    {
        id: 4,
        name: 'Session #3',
        price: 150,
        duration: '2 hours of shooting time',
        details: ['Up to 2 outfits, up to 3 locations', '35 edited photos, plus b+w edits'],
        imageUrl: 'https://res.cloudinary.com/drtfqetrk/image/upload/v1722137714/MariaB%20Grad%2024/ohc1yjkkqxmisgujylgl.jpg',
        dataPath: 'ibellaphotos/session-3'
    }
];

app.get('/search', async (req, res) => {
  const searchQuery = req.query.q;
  try {
    const [results] = await pool.query(`SELECT * FROM galleries WHERE name LIKE ?`, [`%${searchQuery}%`]);
    res.json({ galleries: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/gallery', async (req, res) => {
  try {
    const galleryId = req.query.id;
    console.log('Received request for gallery with ID:', galleryId);

    const photos = await dbUtils.fetchFirstSixPhotosFromDatabase(galleryId);
    console.log('Fetched photos:', photos);

    const gallery = await dbUtils.fetchGalleryById(galleryId);
    console.log('Fetched Gallery:', gallery);

    res.render('gallery_view', { gallery, photos });
  } catch (error) {
    console.error('Error handling gallery request:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/galleries', async (req, res) => {
  try {
    const galleries = await dbUtils.fetchGalleriesFromDatabase();
    res.render('gallery', { galleries });
  } catch (error) {
    console.error('Error fetching galleries:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/booking', (req, res) => {
    res.render('booking', { bookingOptions });
});

    app.get('/booking/:id', (req, res) => {
        const bookingId = parseInt(req.params.id, 10);
        const booking = bookingOptions.find(option => option.id === bookingId);
        if (booking) {
            res.render('booking-view', { booking });
        } else {
            res.status(404).send('Booking option not found');
        }
    });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

