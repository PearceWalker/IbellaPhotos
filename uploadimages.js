require('dotenv').config(); // Load .env file
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise'); // Import mysql2 package with promises support

// Configure Cloudinary
cloudinary.config({
    cloud_name:  process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });
  

async function insertGallery(name, description) {
    const connection = await mysql.createPool({
        host: 'monorail.proxy.rlwy.net',  
        user: 'root',  
        password: 'odfuyANXguisoUygwNVoomfJDWjBighP',
        database: 'photo_gallery',
        port: '54229',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        const galleryData = { name, description };
        const sql = 'INSERT INTO galleries SET ?';
        const [results] = await connection.query(sql, galleryData);
        console.log('Gallery inserted into the database');
        return results.insertId; // Return the ID of the inserted gallery
    } catch (error) {
        console.error('An error occurred while inserting gallery into the database');
        throw error;
    } finally {
        await connection.end(); // Close the connection pool
    }
}

// Function to insert image data into the images table
async function insertImageData(galleryId, name, url, publicId) {
    const connection = await mysql.createPool({
        host: 'monorail.proxy.rlwy.net',  
        user: 'root',  
        password: 'odfuyANXguisoUygwNVoomfJDWjBighP',
        database: 'photo_gallery',
        port: '54229',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        const imageData = { gallery_id: galleryId, name, url, public_id: publicId };
        const sql = 'INSERT INTO images SET ?';
        await connection.query(sql, imageData);
        console.log('Image data inserted into the database');
    } catch (error) {
        console.error('An error occurred while inserting image data into the database');
        throw error;
    } finally {
        await connection.end(); // Close the connection pool
    }
}

const folderPath = 'C:\\Users\\izzie\\Downloads\\MariaBGrad24';

async function uploadImages() {
    try {
        const galleryId = await insertGallery('Maria Grad Shoot', 'MariaBGrad24');
        const files = fs.readdirSync(folderPath);
        const folderName = 'MariaBGrad24';

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            try {
                const uploadResult = await cloudinary.uploader.upload(filePath, { folder: folderName });
                console.log(`Uploaded ${file}: ${uploadResult.secure_url}`);
                await insertImageData(galleryId, file, uploadResult.secure_url, uploadResult.public_id);
            } catch (uploadError) {
                console.error(`Error uploading ${file}:`, uploadError.message);
            }
        }

        console.log('Bulk upload complete!');
    } catch (error) {
        console.error('Error reading directory:', error);
    }
}

// Call the function to start the upload process
uploadImages();