const express = require('express');
const db = require('./database');  
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const PORT = 4050;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
    next();
});

app.get('/', (req, res) => {
    res.render('index', { pageTitle: 'Dashboard' });
});


app.get('/pupuk', async (req, res) => {
    try {
        const pupukList = await db.query('SELECT * FROM pupuk');
        res.render('pupuk', { pupukList });
    } catch (err) {
        res.status(500).render('error', {
            message: 'Gagal mengambil data pupuk',
            error: err
        });
    }
});


app.get('/bibit', async (req, res) => {
    try {
        const bibitList = await db.query('SELECT * FROM bibit');
        res.render('bibit', { bibitList });
    } catch (err) {
        res.status(500).render('error', {
            message: 'Gagal mengambil data bibit',
            error: err
        });
    }
});

app.get('/pupuk/edit/:id', async (req, res) => {
    try {
        const pupukId = req.params.id;
        const result = await db.query('SELECT * FROM pupuk WHERE id = ?', [pupukId]);
        if (result.length === 0) {
            req.flash('error', 'Data pupuk tidak ditemukan');
            return res.redirect('/pupuk');
        }
        res.render('edit-form', {
            editType: 'Pupuk',
            item: result[0],
            pageTitle: 'Edit Pupuk',
            layout: 'layouts/main'
        });
    } catch (err) {
        req.flash('error', 'Gagal mengambil data pupuk');
        res.redirect('/pupuk');
    }
});

app.get('/bibit/edit/:id', async (req, res) => {
    try {
        const bibitId = req.params.id;
        const result = await db.query('SELECT * FROM bibit WHERE id = ?', [bibitId]);
        if (result.length === 0) {
            req.flash('error', 'Data bibit tidak ditemukan');
            return res.redirect('/bibit');
        }
        res.render('edit-form', {
            editType: 'Bibit',
            item: result[0],
            pageTitle: 'Edit Bibit',
            layout: 'layouts/main'
        });
    } catch (err) {
        req.flash('error', 'Gagal mengambil data bibit');
        res.redirect('/bibit');
    }
});

app.post('/pupuk/edit/:id', async (req, res) => {
    try {
        const { nama_pupuk, jenis_pupuk, stok, harga_per_kg } = req.body;
        const pupukId = req.params.id;
        
        if (!nama_pupuk || !jenis_pupuk || !stok || !harga_per_kg) {
            req.flash('error', 'Semua field harus diisi');
            return res.redirect(`/pupuk/edit/${pupukId}`);
        }

        await db.query(
            'UPDATE pupuk SET nama_pupuk = ?, jenis_pupuk = ?, stok = ?, harga_per_kg = ? WHERE id = ?',
            [nama_pupuk, jenis_pupuk, stok, harga_per_kg, pupukId]
        );
        req.flash('success', 'Data pupuk berhasil diperbarui');
        res.redirect('/pupuk');
    } catch (err) {
        req.flash('error', 'Gagal memperbarui data pupuk');
        res.redirect('/pupuk');
    }
});

app.post('/bibit/edit/:id', async (req, res) => {
    try {
        const { nama_bibit, jenis_tanaman, stok, harga } = req.body;
        const bibitId = req.params.id;

        if (!nama_bibit || !jenis_tanaman || !stok || !harga) {
            req.flash('error', 'Semua field harus diisi');
            return res.redirect(`/bibit/edit/${bibitId}`);
        }

        await db.query(
            'UPDATE bibit SET nama_bibit = ?, jenis_tanaman = ?, stok = ?, harga = ? WHERE id = ?',
            [nama_bibit, jenis_tanaman, stok, harga, bibitId]
        );
        req.flash('success', 'Data bibit berhasil diperbarui');
        res.redirect('/bibit');
    } catch (err) {
        req.flash('error', 'Gagal memperbarui data bibit');
        res.redirect('/bibit');
    }
});

app.post('/pupuk', async (req, res) => {
    try {
        const { nama_pupuk, jenis_pupuk, stok, harga_per_kg } = req.body;

        if (!nama_pupuk || !jenis_pupuk || !stok || !harga_per_kg) {
            req.flash('error', 'Semua field harus diisi');
            return res.redirect('/pupuk');
        }

        await db.query(
            'INSERT INTO pupuk (nama_pupuk, jenis_pupuk, stok, harga_per_kg) VALUES (?, ?, ?, ?)',
            [nama_pupuk, jenis_pupuk, stok, harga_per_kg]
        );
        req.flash('success', 'Data pupuk berhasil ditambahkan');
        res.redirect('/pupuk');
    } catch (err) {
        req.flash('error', 'Gagal menambahkan data pupuk');
        res.redirect('/pupuk');
    }
});

app.post('/bibit', async (req, res) => {
    try {
        const { nama_bibit, jenis_tanaman, stok, harga } = req.body;

        if (!nama_bibit || !jenis_tanaman || !stok || !harga) {
            req.flash('error', 'Semua field harus diisi');
            return res.redirect('/bibit');
        }

        await db.query(
            'INSERT INTO bibit (nama_bibit, jenis_tanaman, stok, harga) VALUES (?, ?, ?, ?)',
            [nama_bibit, jenis_tanaman, stok, harga]
        );
        req.flash('success', 'Data bibit berhasil ditambahkan');
        res.redirect('/bibit');
    } catch (err) {
        req.flash('error', 'Gagal menambahkan data bibit');
        res.redirect('/bibit');
    }
});

