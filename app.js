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

