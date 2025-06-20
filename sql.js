const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // replace with your MySQL username
    password: '',         // replace with your MySQL password
    database: 'food_paradise'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Route to handle form submission
app.post('/register', (req, res) => {
    const { 'full-name': fullName, email, password, dob, gender } = req.body;

    const sql = 'INSERT INTO users (full_name, email, password, dob, gender) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [fullName, email, password, dob, gender], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error saving data');
        } else {
            console.log('User data inserted:', result);
            res.send('Registration successful!');
        }
    });
});

// Start server
app.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
});
