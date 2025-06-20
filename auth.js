const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For login tokens

const app = express();
const url = "mongodb://localhost:27017"; // MongoDB connection URL
const client = new MongoClient(url);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const SECRET_KEY = "mysecretkey"; // Secret key for JWT generation

// Connect to MongoDB
async function connectToDB() {
  await client.connect();
  return client.db("userDB"); // Use 'userDB' database
}

// 1. Signup (Create)
app.post("/signup", async (req, res) => {
  try {
    const db = await connectToDB();
    const usersCollection = db.collection("users"); // Use 'users' collection
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await usersCollection.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send("Username or Email already exists.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const user = { username, email, password: hashedPassword };
    await usersCollection.insertOne(user);

    res.status(201).send("User registered successfully!");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Error during signup.");
  }
});

// 2. Login (Read)
app.post("/login", async (req, res) => {
  try {
    const db = await connectToDB();
    const usersCollection = db.collection("users"); // Use 'users' collection
    const { email, password } = req.body;

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send("Invalid credentials.");
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email, username: user.username }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Error during login.");
  }
});

// 3. Logout (Delete Token)
app.post("/logout", (req, res) => {
  try {
    // Invalidate token (if using a token blacklist, implement logic here)
    res.status(200).send("Logout successful!");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send("Error during logout.");
  }
});

// Start the server
app.listen(3002, () => console.log("Auth server running at http://localhost:3002"));
