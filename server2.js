const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/foodparadise', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Order Schema
const orderSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    cartData: Array,
    totalAmount: Number
});
const Order = mongoose.model('Order', orderSchema);

// Define the POST route for orders
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(200).json({ message: 'Order placed successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to place order', error: err });
    }
});

// Define a simple GET route to check server response (for testing)
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
