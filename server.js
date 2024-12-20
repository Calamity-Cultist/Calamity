const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const mysql = require('mysql2');
const secretKey = "my-portfolio";
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require ('cookie-parser');

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"fredthing"
})

db.connect(err => {
    if(err){
        console.error('failed to connect DB' , err);
        return;
    }
    console.log ("success to connect DB");
})

// Add role to users table if it doesn't exist
db.execute(`
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS role VARCHAR(10) DEFAULT 'client'
`, (err) => {
    if(err) {
        console.error('Error adding role column:', err);
    } else {
        console.log('Role column added or already exists');
    }
});

app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use('/css', express.static(path.join(__dirname, 'login/css')));
app.use('/js', express.static(path.join(__dirname, 'login/js')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/client', express.static(path.join(__dirname, 'client')));

// Routes order is important
// 1. First, handle authentication routes
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login/login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'login/signup.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login/login.html'));
});

// 2. Then, static files
app.use('/login', express.static(path.join(__dirname, 'login')));

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
        
        // Compare password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).send('Invalid credentials')
            }            
            // Generate JWT token with role
            const token = jwt.sign(
                {
  
                    username: user.username,
                    role: user.role
                }, 
                secretKey, 
                {expiresIn: '1h'}
            );
            
            res.cookie('token', token, {httpOnly: true, secure:false});

            // Send role-based redirect
            const redirectUrl = user.role === 'admin' ? '/admin' : '/client';
            res.json({
                success: true,
                message: 'Logged in successfully',
                redirectUrl: redirectUrl
            });
        });
    });
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

function authenticateToken(req, res, next) {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                res.clearCookie('token');
            }
            console.log(err);
            return res.redirect('/login');
        }
        req.user = user;
        next();
    });
}

// 3. Protected routes
app.use('/admin', authenticateToken, requireAdmin);
app.use('/client', authenticateToken);

app.get('/admin/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/index.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/index.html'));
});

function requireAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Access denied');
    }
}

app.post('/signup', (req, res) => {
    const { username, password, role = 'client' } = req.body;
    
    // Check if username already exists
    db.execute('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
            return res.status(500).send('Server Error');
        }
        if (result.length > 0) {
            return res.status(400).send('Username already exists');
        }
        
        // Hash password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).send('Error hashing password');
            }
            
            // Insert new user with role
            db.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
                [username, hashedPassword, role], 
                (err, result) => {
                    if (err) {
                        return res.status(500).send('Error creating user');
                    }
                    res.json({ 
                        success: true, 
                        message: 'User created successfully',
                        redirectUrl: '/login'
                    });
                }
            );
        });
    });
});

app.get('/api/services', (req,res) => {
    const query = 'SELECT * FROM services';
    db.query(query,(err,result) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        res.json(result);
    })
})

app.listen(PORT,() => {console.log(`Server Running at http://localhost:${PORT}`);})