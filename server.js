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
    database:"calamity"
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

// Create products table if it doesn't exist
db.execute(`
    CREATE TABLE IF NOT EXISTS product (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        out_of_order BOOLEAN DEFAULT 0
    )
`, (err) => {
    if(err) {
        console.error('Error creating products table:', err);
    } else {
        console.log('Products table created or already exists');
    }
});

app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/client', express.static(path.join(__dirname, 'Client')));
app.use('/auth', express.static(path.join(__dirname, 'login')));

// Redirect root URL to Client/index.html
app.get('/', (req, res) => {
    res.redirect('/client/index.html');
});

// Routes order is important
// 1. First, handle authentication routes
app.get('/auth/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login/login.html'));
});

app.get('/auth/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'login/signup.html'));
});

// Client route serves the client index
app.get('/client', (req, res) => {
    res.sendFile(path.join(__dirname, 'Client/index.html'));
});

app.post('/auth/login', (req, res) => {
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
            
            // Set role-specific cookie
            res.cookie('token', token, {httpOnly: true, secure: false});
            res.cookie('userRole', user.role, {httpOnly: false, secure: false}); 
            res.cookie('username', user.username, {httpOnly: false, secure: false}); 

            // Redirect based on role
            if (user.role === 'admin') {
                res.json({
                    success: true,
                    message: 'Admin logged in successfully',
                    redirectUrl: '/admin/index.html'
                });
            } else {
                res.json({
                    success: true,
                    message: 'Client logged in successfully',
                    redirectUrl: '/client/index.html'
                });
            }
        });
    });
})

app.get('/auth/logout', (req, res) => {
    // Clear all cookies
    res.clearCookie('token');
    res.clearCookie('userRole');
    res.clearCookie('username');
    res.redirect('/auth/login');
});

function authenticateToken(req, res, next) {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.redirect('/auth/login');
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                res.clearCookie('token');
            }
            console.log(err);
            return res.redirect('/auth/login');
        }
        req.user = user;
        next();
    });
}

// Protected routes with role-based access
app.use('/admin', authenticateToken, requireAdmin);
app.use('/client', authenticateToken, requireClient);

function requireAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Access denied');
    }
}

function requireClient(req, res, next) {
    if (req.user && req.user.role === 'client') {
        next();
    } else {
        res.status(403).send('Access denied');
    }
}

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/index.html'));
});

app.get('/client', (req, res) => {
    res.sendFile(path.join(__dirname, 'Client/index.html'));
});

app.post('/auth/signup', (req, res) => {
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
                        redirectUrl: '/auth/login'
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

// API endpoints for products
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM product', (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

app.post('/api/products', authenticateToken, requireAdmin, (req, res) => {
    const { title, image, price, description } = req.body;
    
    if (!title || !image || !price || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = 'INSERT INTO product (title, image, price, description) VALUES (?, ?, ?, ?)';
    db.query(query, [title, image, price, description], (err, result) => {
        if (err) {
            console.error('Error adding product:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(201).json({ message: 'Product added successfully' });
    });
});

// Toggle out of order status endpoint
app.post('/api/products/toggle-status/:title', (req, res) => {
    const title = req.params.title;
    
    // First get current status
    db.query('SELECT out_of_order FROM product WHERE title = ?', [title], (error, results) => {
        if (error) {
            console.error('Error getting product status:', error);
            res.status(500).json({ error: 'Failed to get product status' });
            return;
        }
        
        if (results.length === 0) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        
        const newStatus = !results[0].out_of_order;
        
        // Update status
        db.query('UPDATE product SET out_of_order = ? WHERE title = ?', [newStatus, title], (updateError) => {
            if (updateError) {
                console.error('Error updating product status:', updateError);
                res.status(500).json({ error: 'Failed to update product status' });
                return;
            }
            res.json({ success: true, outOfOrder: newStatus });
        });
    });
});

// Toggle product out_of_order status
app.post('/api/products/toggle-status', authenticateToken, requireAdmin, (req, res) => {
    const { productTitle, outOfOrder } = req.body;
    
    if (!productTitle) {
        return res.status(400).json({ error: 'Product title is required' });
    }

    const query = 'UPDATE product SET out_of_order = ? WHERE title = ?';
    db.query(query, [outOfOrder, productTitle], (err, result) => {
        if (err) {
            console.error('Error updating product status:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ message: 'Product status updated successfully' });
    });
});

// Add new drink endpoint
app.post('/api/products/add', (req, res) => {
    const { title, price, description, image } = req.body;
    
    console.log('Received data:', { title, price, description, image }); // Debug log
    
    if (!title || !price || !description || !image) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO product (title, price, description, image, out_of_order) VALUES (?, ?, ?, ?, false)';
    db.query(query, [title, price, description, image], (error, results) => {
        if (error) {
            console.error('Database error:', error); // Debug log
            res.status(500).json({ error: 'Failed to add new drink', details: error.message });
            return;
        }
        res.json({ success: true, id: results.insertId });
    });
});

app.listen(PORT,() => {console.log(`Server Running at http://localhost:${PORT}`);})