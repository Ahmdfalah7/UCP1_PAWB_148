const express = require('express');
const db = require('./database');  // Pastikan file database.js sudah benar dan terhubung
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// Halaman Utama
app.get('/', (req, res) => {
    res.send('Selamat datang di aplikasi pertanian!');
});

// Halaman EJS untuk Pupuk
app.get('/pupuk', (req, res) => {
    const sql = 'SELECT * FROM pupuk';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send('Gagal mengambil data pupuk');
        } else {
            res.render('pupuk', { pupukList: results });
        }
    });
});

// Halaman EJS untuk Bibit
app.get('/bibit', (req, res) => {
    const sql = 'SELECT * FROM bibit';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send('Gagal mengambil data bibit');
        } else {
            res.render('bibit', { bibitList: results });
        }
    });
});

// API CRUD untuk Pupuk
app.post('/pupuk', (req, res) => {
    const { nama_pupuk, jenis_pupuk, kandungan_npk, stok, harga_per_kg } = req.body;
    const sql = 'INSERT INTO pupuk (nama_pupuk, jenis_pupuk, kandungan_npk, stok, harga_per_kg) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nama_pupuk, jenis_pupuk, kandungan_npk, stok, harga_per_kg], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.redirect('/pupuk'); // Redirect ke halaman pupuk setelah menyimpan
        }
    });
});

// API CRUD untuk Bibit
app.post('/bibit', (req, res) => {
    const { nama_bibit, jenis_tanaman, umur_panen, stok, harga_per_unit } = req.body;
    const sql = 'INSERT INTO bibit (nama_bibit, jenis_tanaman, umur_panen, stok, harga_per_unit) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nama_bibit, jenis_tanaman, umur_panen, stok, harga_per_unit], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.redirect('/bibit'); // Redirect ke halaman bibit setelah menyimpan
        }
    });
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
