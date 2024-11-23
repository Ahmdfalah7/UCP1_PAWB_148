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

// Middleware untuk flash messages
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

// Route untuk menampilkan data bibit
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


