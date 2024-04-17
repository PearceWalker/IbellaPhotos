const express = require('express');
const photoRoutes = require('./routes/photoRoutes'); // Adjust the path as needed

const app = express();
const PORT = process.env.PORT || 3000;

// Mount route modules
app.use('/photos', photoRoutes); // Mount photoRoutes at /photos

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
