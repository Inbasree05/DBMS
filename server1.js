const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Enable CORS for cross-origin requests
app.use(cors());

// Middleware for parsing JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/foodparadise', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully!"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Define schema for orders
const orderSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    cartData: Array, // Expecting an array of cart items
    date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Handle checkout form submissions
app.post('/order', async (req, res) => {
    const { name, phone, address, cartData } = req.body;

    // Log incoming data for debugging
    console.log("📥 Received order data:", req.body);

    try {
        // Save order data to the database
        const order = new Order({
            name,
            phone,
            address,
            cartData: JSON.parse(cartData) // Parse cart data if it's sent as a JSON string
        });

        await order.save();
        console.log("✅ Order saved successfully:", order);
        res.send("✅ Order placed successfully!");
    } catch (error) {
        console.error("❌ Error saving order:", error);
        res.status(500).send("❌ Failed to place order. Please try again later.");
    }
});

// Welcome route for testing server functionality
app.get('/', (req, res) => {
    res.send('Welcome to Food Paradise Backend!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
