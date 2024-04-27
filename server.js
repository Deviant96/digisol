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

/*--------------------------------------------------*/
/*-------------------- Routes ----------------------*/
/*--------------------------------------------------*/

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

app.get('/api/products/:id', validateProductId, (req, res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [productId], (err, results) => {
        if (err) {
            throw err;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    });
});

app.post('/api/products', validateProductData, (req, res) => {
    const { brand, type, stock, price, additional_info } = req.body;
    const sql = 'INSERT INTO products (brand, type, stock, price, additional_info) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [brand, type, stock, price, additional_info], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({ message: 'Product added successfully', id: result.insertId });
    });
});

app.put('/api/products/:id', validateProductId, validateProductData, (req, res) => {
    const { brand, type, stock, price, additional_info } = req.body;
    const id = req.params.id;
    const sql = 'UPDATE products SET brand=?, type=?, stock=?, price=?, additional_info=? WHERE id=?';
    db.query(sql, [brand, type, stock, price, additional_info, id], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully' });
    });
});

app.delete('/api/products/:id', validateProductId, (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM products WHERE id=?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

/*--------------------------------------------------*/
/*----------------- Validations --------------------*/
/*--------------------------------------------------*/

const validateProductData = (req, res, next) => {
    const { brand, type, stock, price } = req.body;
    if (!brand || !type || !stock || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (isNaN(stock) || isNaN(price) || stock < 0 || price < 0) {
        return res.status(400).json({ message: 'Stock and price must be non-negative numbers' });
    }
    next();
};

const validateProductId = (req, res, next) => {
    const productId = req.params.id;
    if (!Number.isInteger(parseInt(productId))) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }
    next();
};

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
