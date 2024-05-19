const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    try {
        const [rows] = await connection.execute('SHOW TABLES');
        console.log('Tables in the database:', rows);
    } catch (error) {
        console.error('Error executing query:', error);
    } finally {
        await connection.end();
    }
}

checkDatabase().catch(err => {
    console.error('Error connecting to the database:', err);
});

