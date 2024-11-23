const mysql = require('mysql');


const dbConfig = {
    host: 'localhost',
    user: 'root', 
    password: '',
    database: 'pertanian',
    multipleStatements: true,
    connectTimeout: 20000, 
    acquireTimeout: 20000 
};


const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Gagal terhubung ke database:', err.message);
        process.exit(1); 
    } else {
        console.log('Berhasil terhubung ke database MySQL.');
        connection.release();
    }
});

const query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (error, results) => {
            if (error) {
                console.error('Database query error:', error);
                reject(error);
            } else {
                resolve(results); 
            }
        });
    });
};

pool.on('error', (err) => {
    console.error('Database pool error:', err);
    process.exit(1);
});

module.exports = {
    query,
    pool
};


