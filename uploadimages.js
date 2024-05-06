const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dyam4n6rx',
  api_key: '125485311227336',
  api_secret: 'zinrYAssjZ_Htef49Di7ptcAzKY'
});


const folderPath = 'C:\\Users\\izzie\\Downloads\\gianna';


async function uploadImages() {
  try {
    const files = fs.readdirSync(folderPath);
    const folderName = 'gianna';
    
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      try {
        const uploadResult = await cloudinary.uploader.upload(filePath, { folder: folderName });
        console.log(`Uploaded ${file}: ${uploadResult.secure_url}`);
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
