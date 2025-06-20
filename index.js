const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/foodparadise', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('MongoDB connection error:', err));

// Define Order Schema and Model
const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  cartData: Array,
  totalPrice: Number,
});

const Order = mongoose.model('Order', orderSchema);

// Route to handle order submission
app.post('/order', async (req, res) => {
  try {
    const { name, phone, address, cartData } = req.body;

    // Calculate total price
    let totalPrice = 0;
    cartData.forEach(item => {
      totalPrice += item.price * item.quantity;
    });

    // Create a new order
    const newOrder = new Order({
      name,
      phone,
      address,
      cartData,
      totalPrice,
    });

    // Save the order to the database
    await newOrder.save();
    res.status(200).json({ message: 'Order placed successfully!' });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
