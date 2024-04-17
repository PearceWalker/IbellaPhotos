// photoRoutes.js

const express = require('express');
const router = express.Router();

// Define routes
router.get('/', (req, res) => {
    res.send('Welcome to the photo gallery!');
});

router.post('/upload', (req, res) => {
    // Handle photo upload logic
    res.send('Photo uploaded successfully!');
});

// Export the router
module.exports = router;
