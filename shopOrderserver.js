const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',     // Your MySQL username
    password: 'Inbasree@2005',     // Your MySQL password
    database: 'shop_db'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Test database connection
db.query('SELECT 1', (err, results) => {
    if (err) {
        console.error('Database connection test failed:', err);
    } else {
        console.log('Database connection test successful');
    }
});

// Create Order (POST)
app.post('/orders', (req, res) => {
    const { name, email, phone, address, customMsg, deliveryDate, payment, items, totalAmount } = req.body;
    
    // Add console logs to see the data
    console.log('Received order data:', req.body);
    
    const orderQuery = 'INSERT INTO orders (name, email, phone, address, custom_msg, delivery_date, payment_method, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(orderQuery, [name, email, phone, address, customMsg, deliveryDate, payment, totalAmount], (err, result) => {
        if (err) {
            console.error('Error creating order:', err);
            res.status(500).json({ error: 'Error creating order' });
            return;
        }

        console.log('Order created with ID:', result.insertId);
        
        const orderId = result.insertId;
        
        // Insert order items
        const itemQueries = items.map(item => {
            return new Promise((resolve, reject) => {
                const itemQuery = 'INSERT INTO order_items (order_id, item_name, quantity, price) VALUES (?, ?, ?, ?)';
                db.query(itemQuery, [orderId, item.item, item.quantity, item.price], (err, result) => {
                    if (err) {
                        console.error('Error inserting item:', err);
                        reject(err);
                    } else {
                        console.log('Item inserted:', item);
                        resolve(result);
                    }
                });
            });
        });

        Promise.all(itemQueries)
            .then(() => {
                console.log('All items inserted successfully');
                res.status(201).json({ message: 'Order created successfully', orderId });
            })
            .catch(err => {
                console.error('Error creating order items:', err);
                res.status(500).json({ error: 'Error creating order items' });
            });
    });
});

// Get All Orders (GET)
app.get('/orders', (req, res) => {
    const query = 'SELECT * FROM orders ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            res.status(500).json({ error: 'Error fetching orders' });
            return;
        }
        res.json(results);
    });
});

// Get Single Order (GET)
app.get('/orders/:id', (req, res) => {
    const orderId = req.params.id;
    
    const orderQuery = 'SELECT * FROM orders WHERE order_id = ?';
    const itemsQuery = 'SELECT * FROM order_items WHERE order_id = ?';
    
    db.query(orderQuery, [orderId], (err, orderResult) => {
        if (err) {
            console.error('Error fetching order:', err);
            res.status(500).json({ error: 'Error fetching order' });
            return;
        }

        if (orderResult.length === 0) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }

        db.query(itemsQuery, [orderId], (err, itemsResult) => {
            if (err) {
                console.error('Error fetching order items:', err);
                res.status(500).json({ error: 'Error fetching order items' });
                return;
            }

            res.json({
                order: orderResult[0],
                items: itemsResult
            });
        });
    });
});

// Update Order (PUT)
app.put('/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const { name, email, phone, address, customMsg, deliveryDate, payment, items, totalAmount } = req.body;

    const orderQuery = 'UPDATE orders SET name = ?, email = ?, phone = ?, address = ?, custom_msg = ?, delivery_date = ?, payment_method = ?, total_amount = ? WHERE order_id = ?';
    
    db.query(orderQuery, [name, email, phone, address, customMsg, deliveryDate, payment, totalAmount, orderId], (err, result) => {
        if (err) {
            console.error('Error updating order:', err);
            res.status(500).json({ error: 'Error updating order' });
            return;
        }

        // Delete existing items
        db.query('DELETE FROM order_items WHERE order_id = ?', [orderId], (err) => {
            if (err) {
                console.error('Error deleting existing items:', err);
                res.status(500).json({ error: 'Error updating order items' });
                return;
            }

            // Insert new items
            const itemQueries = items.map(item => {
                return new Promise((resolve, reject) => {
                    const itemQuery = 'INSERT INTO order_items (order_id, item_name, quantity, price) VALUES (?, ?, ?, ?)';
                    db.query(itemQuery, [orderId, item.item, item.quantity, item.price], (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
            });

            Promise.all(itemQueries)
                .then(() => {
                    res.json({ message: 'Order updated successfully' });
                })
                .catch(err => {
                    console.error('Error updating order items:', err);
                    res.status(500).json({ error: 'Error updating order items' });
                });
        });
    });
});

// Delete Order (DELETE)
app.delete('/orders/:id', (req, res) => {
    const orderId = req.params.id;
    
    db.query('DELETE FROM orders WHERE order_id = ?', [orderId], (err, result) => {
        if (err) {
            console.error('Error deleting order:', err);
            res.status(500).json({ error: 'Error deleting order' });
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }

        res.json({ message: 'Order deleted successfully' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});