const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static HTML, CSS, JS

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Add your password if needed
    database: 'food_paradise'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

// POST route to save order
app.post('/order', (req, res) => {
    const { name, phone, address, cartData } = req.body;

    const query = `
        INSERT INTO orders (name, phone, address, cart_data)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [name, phone, address, cartData], (err, result) => {
        if (err) {
            console.error('Insert error:', err);
            return res.status(500).send('Database error.');
        }
        res.send('<h2>Order placed successfully!</h2><a href="checkout.html">Back to Checkout</a>');
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
