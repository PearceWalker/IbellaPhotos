const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise'); // Import mysql2 package with promises support

const ENV = 'dev'; // Change to 'production' as needed

const envFile = ENV === 'production' ? '.env.production' : '.env.dev';
dotenv.config({ path: envFile });


// Configure Cloudinary
cloudinary.config({
    cloud_name:  process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });


function generatePassword(galleryName) {
    const randomNum = Math.floor(100 + Math.random() * 900); 
    const sanitizedGalleryName = galleryName.replace(/\s+/g, '');
    return sanitizedGalleryName + randomNum;
}

  

async function insertGallery(name, description) {
    const connection = await mysql.createPool({
        host: process.env.DB_HOST,  
        user: process.env.DB_USER,  
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        const password = generatePassword(name); // Generate the password
        const galleryData = { name, description, password }; // Add password to gallery data
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
        host: process.env.DB_HOST,  
        user: process.env.DB_USER,  
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
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

const folderPath = 'C:\\Users\\pearc\\Downloads\\MariaBGrad24';

async function uploadImages() {
    try {
        const galleryId = await insertGallery('MariaB Grad 24', 'MariaB Grad 24');
        const files = fs.readdirSync(folderPath);
        const folderName = 'MariaB Grad 24';

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