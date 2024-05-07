const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: '127.0.0.1',  
    user: 'root',  
    password: '1311FhU6*',
    database: 'photo_gallery',
    port: '3306'
});

connection.connect((err) => {
    if (err) {
        console.error('An error occurred while connecting to the DB');
        throw err;
    }
    console.log('Connected to the database');
});

module.exports = connection;

