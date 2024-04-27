require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected');
});

app.use(bodyParser.json());

app.get('/api/products', (req, res) => {
    const { brand } = req.query;
    let sql = 'SELECT * FROM products';
    let values = [];
    if (brand) {
        sql += ' WHERE brand LIKE ?';
        values = [`%${brand}%`];
    }
    db.query(sql, values, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});

app.post('/api/products', (req, res) => {
    const { brand, type, stock, price, additional_info } = req.body;
    const sql = 'INSERT INTO products (brand, type, stock, price, additional_info) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [brand, type, stock, price, additional_info], (err, result) => {
        if (err) {
            throw err;
        }
        res.json({ message: 'Product added successfully', id: result.insertId });
    });
});

app.put('/api/products/:id', (req, res) => {
    const { brand, type, stock, price, additional_info } = req.body;
    const id = req.params.id;
    const sql = 'UPDATE products SET brand=?, type=?, stock=?, price=?, additional_info=? WHERE id=?';
    db.query(sql, [brand, type, stock, price, additional_info, id], (err, result) => {
        if (err) {
            throw err;
        }
        res.json({ message: 'Product updated successfully' });
    });
});

app.delete('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM products WHERE id=?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            throw err;
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
