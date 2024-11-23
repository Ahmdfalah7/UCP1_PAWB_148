const mysql = require('mysql');

// Konfigurasi koneksi ke database
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pertanian',
    multipleStatements: true,
};

// Membuat koneksi ke database
const connection = mysql.createConnection(dbConfig);

// Menangani koneksi
connection.connect((err) => {
    if (err) {
        console.error('Gagal terhubung ke database:', err.message);
    } else {
        console.log('Berhasil terhubung ke database MySQL.');
    }
});

module.exports = connection;
