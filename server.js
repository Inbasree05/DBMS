const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Inbasree@2005',
  database: 'food_order_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL database.');
});

// Home route
app.get('/', (req, res) => {
  res.send('🍔 Welcome to the Food Order API');
});

// CREATE - Place a new order
app.post('/submit-order', (req, res) => {
  const { customer_name, mobile_number, food_item, quantity } = req.body;
  const query = 'INSERT INTO orders (customer_name, mobile_number, food_item, quantity) VALUES (?, ?, ?, ?)';
  db.query(query, [customer_name, mobile_number, food_item, quantity], (err, result) => {
    if (err) {
      console.error('❌ Database insertion error:', err.message);
      return res.status(500).send('Database insertion error: ' + err.message);
    }
    console.log('📦 Order saved with ID:', result.insertId);
    res.send('🎉 Order placed successfully!');
  });
});

// READ - Get all orders
app.get('/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) return res.status(500).send('Error retrieving orders');
    res.json(results);
  });
});

// UPDATE - Update an order
app.put('/update-order/:id', (req, res) => {
  const orderId = req.params.id;
  const { customer_name, mobile_number, food_item, quantity } = req.body;
  const query = 'UPDATE orders SET customer_name=?, mobile_number=?, food_item=?, quantity=? WHERE id=?';
  db.query(query, [customer_name, mobile_number, food_item, quantity, orderId], (err, result) => {
    if (err) return res.status(500).send('❌ Update Error: ' + err.message);
    if (result.affectedRows === 0) return res.status(404).send('❗ Order not found.');
    res.send('✏️ Order updated successfully!');
  });
});

// DELETE - Remove an order
app.delete('/delete-order/:id', (req, res) => {
  const orderId = req.params.id;
  db.query('DELETE FROM orders WHERE id = ?', [orderId], (err, result) => {
    if (err) return res.status(500).send('❌ Delete Error: ' + err.message);
    if (result.affectedRows === 0) return res.status(404).send('❗ Order not found.');
    res.send('🗑️ Order deleted successfully!');
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
