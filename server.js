// server.js

const express = require('express');
const { google } = require('googleapis');

const app = express();
const port = 3000; // Choose a port number

// Google Drive API setup
const apiKeys = require('./apiKey.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

async function authorize() {
    const jwtClient = new google.auth.JWT(
        apiKeys.client_email,
        null,
        apiKeys.private_key,
        SCOPES
    );
    await jwtClient.authorize();
    return jwtClient;
}

// Endpoint for fetching a specific file
app.get('/getFile', async (req, res) => {
    try {
        const fileId = req.query.fileId;
        if (!fileId) {
            return res.status(400).json({ error: 'File ID is required.' });
        }

        const auth = await authorize();
        const drive = google.drive({ version: 'v3', auth });

        const response = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink'
        });

        const file = response.data;
        res.json(file);
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
