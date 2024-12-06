const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const { error } = require('console');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_portfolio"
})

db.connect((err) => {
    if (err) {
        console.error('Failed to connect DB', err);
        return;
    }
    console.log('Success to connect DB');
})

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API Login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'))
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.execute('SELECT * FROM users WHERE username = ? ', [username], (err, result) => {
        if (err) {
            return res.status(500).send('Server Error')
        }
        if (result.length == 0) {
            return res.status(401).send('Invalid credentials')
        }
        const user = result[0];
        const secretKey = "my-portfolio";
        
        // Compare password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).send('Invalid credentials')
            }            
            // Generate JWT token
            const token = jwt.sign({id: user.id, username: user.username}, secretKey, {expiresIn: '1h'});
            res.cookie('token', token, {httpOnly: true, secure:false})

            res.send('Logged in succesfully')
        })
    })
})

// API services    
app.get('/api/services', (req, res) => {
    const query = "SELECT * FROM services";

    db.query(query, (err, result) => {
        if (err) {
            return res.status (500).json({error: err.message}); 
        }
        res.json(result);
    })
})

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`);
})