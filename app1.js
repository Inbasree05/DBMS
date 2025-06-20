const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectID } = require("mongodb");
const path = require("path");

const app = express();
const url = "mongodb://localhost:27017"; // MongoDB connection URL
const client = new MongoClient(url);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files like orders.html

// Connect to MongoDB
async function connectToDB() {
  await client.connect();
  return client.db("foodparadise"); // Ensure we are using the correct database
}

// 1. Create a new order
app.post("/create-order", async (req, res) => {
  try {
    const db = await connectToDB();
    const ordersCollection = db.collection("orders");
    const { name, phone, address, cart } = req.body;

    const order = {
      name,
      phone,
      address,
      cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      orderDate: new Date(),
    };

    await ordersCollection.insertOne(order);
    res.status(201).send("Order created successfully!");
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("Error creating order.");
  }
});

// 2. Get orders by user name
app.get("/get-orders/:name", async (req, res) => {
  try {
    const db = await connectToDB();
    const ordersCollection = db.collection("orders");
    const { name } = req.params;

    // Fetch orders where name matches
    const userOrders = await ordersCollection.find({ name }).toArray();

    res.status(200).json(userOrders); // Send user-specific orders as JSON
  } catch (error) {
    console.error("Error fetching orders for user:", error);
    res.status(500).send("Error fetching orders.");
  }
});

// 3. Update order address
app.put("/update-order/:id", async (req, res) => {
  try {
    const db = await connectToDB();
    const ordersCollection = db.collection("orders");
    const { id } = req.params;
    const { address } = req.body;

    await ordersCollection.updateOne(
      { _id: new ObjectID(id) },
      { $set: { address } }
    );

    res.status(200).send("Order address updated successfully!");
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).send("Error updating order.");
  }
});

// 4. Add a product to an order
app.put("/add-product/:id", async (req, res) => {
  try {
    const db = await connectToDB();
    const ordersCollection = db.collection("orders");
    const { id } = req.params;
    const newProduct = req.body;

    await ordersCollection.updateOne(
      { _id: new ObjectID(id) },
      { $push: { cart: newProduct } }
    );

    res.status(200).send("Product added successfully!");
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Error adding product.");
  }
});

// 5. Delete an order by its ID
app.delete("/delete-order/:id", async (req, res) => {
  try {
    const db = await connectToDB();
    const ordersCollection = db.collection("orders");
    const { id } = req.params;

    await ordersCollection.deleteOne({ _id: new ObjectID(id) });

    res.status(200).send("Order deleted successfully!");
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).send("Error deleting order.");
  }
});

// Start the server
app.listen(3001, () => console.log("Server running at http://localhost:3001"));
