const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const mysql = require('mysql2');
const secretKey = "my-portfolio";
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require ('cookie-parser');
const fs = require('fs');
const multer = require('multer');

// Added multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'admin/product/images'))
    },
    filename: function (req, file, cb) {
        // Keep original filename
        cb(null, file.originalname)
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept only image files
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Create database connection pool instead of single connection
const db = mysql.createPool({
    host: process.env.DB_HOST || "auth-db1786.hstgr.io",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "u457788288_root",
    password: process.env.DB_PASSWORD || "Ehetenandayo@123",
    database: process.env.DB_NAME || "u457788288_calamity",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: true
    } : false
});

// Improved error handling for database connection
db.getConnection((err, connection) => {
    if(err) {
        console.error('Failed to connect to DB:', err);
        if (err.code === 'ETIMEDOUT') {
            console.error('Connection timed out. Please check if the database server is accessible and that your firewall settings allow the connection.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Connection refused. Please verify the hostname, port, and that the database server is running.');
        }
        return;
    }
    console.log("Successfully connected to DB");
    connection.release();

    // Test query to check if product table exists and has data
    db.query('SELECT COUNT(*) as count FROM product', (err, results) => {
        if (err) {
            console.error('Error checking product table:', err);
        } else {
            console.log('Number of products in database:', results[0].count);
        }
    });

    // Initialize database tables
    async function initDb() {
        try {
            // Create users table first since it's referenced by foreign keys
            await db.execute(`
                CREATE TABLE IF NOT EXISTS users (
                    user_id int(11) NOT NULL AUTO_INCREMENT,
                    username varchar(255) NOT NULL,
                    password varchar(255) NOT NULL,
                    role enum('client','admin') NOT NULL DEFAULT 'client',
                    PRIMARY KEY (user_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
            `);
            console.log('Users table verified');

            // Create product table
            await db.execute(`
                CREATE TABLE IF NOT EXISTS product (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    title varchar(255) NOT NULL,
                    price varchar(255) NOT NULL,
                    image varchar(255) DEFAULT NULL,
                    description text,
                    out_of_order tinyint(1) DEFAULT 0,
                    PRIMARY KEY (id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
            `);
            console.log('Product table verified');

            // Check if product table is empty
            const [rows] = await db.promise().query('SELECT COUNT(*) as count FROM product');
            if (rows[0].count === 0) {
                // Add sample products with correct image paths
                await db.promise().query(`
                    INSERT INTO product (title, price, image, description, out_of_order) VALUES 
                    ('Mango Juice', 'Rp 15.000', '/Client/product/images/proMang.png', 'Fresh and sweet mango juice made from ripe mangoes', 0),
                    ('Avocado Juice', 'Rp 20.000', '/Client/product/images/proAvo.png', 'Creamy and nutritious avocado juice blend', 0),
                    ('Soursop Juice', 'Rp 15.000', '/Client/product/images/proSour.png', 'Exotic soursop juice with a unique tropical taste', 1),
                    ('Mix Juice', 'Rp 25.000', '/Client/product/images/proMix.png', 'A refreshing blend of mixed tropical fruits', 1),
                    ('Calamity Special', 'Rp 30.000', '/Client/product/images/proCal.png', 'Our signature blend of premium fruits and herbs', 0),
                    ('Apple Juice', 'Rp 18.000', '/Client/product/images/proApp.png', 'Pure and refreshing apple juice', 0),
                    ('Thai Tea', 'Rp 20.000', '/Client/product/images/proThai.png', 'Authentic Thai tea with a rich, creamy taste', 0),
                    ('Monk Fruit Juice', 'Rp 23.000', '/Client/product/images/proMonk.png', 'Naturally sweetened monk fruit juice blend', 0),
                    ('Herbal Green Tea', 'Rp 13.000', '/Client/product/images/proHerb.png', 'Healthy blend of green tea and natural herbs', 0)
                `);
                console.log('Sample products added');
            }

            // Create user_logs table with correct foreign key reference
            await db.execute(`
                CREATE TABLE IF NOT EXISTS user_logs (
                    log_id int(11) NOT NULL AUTO_INCREMENT,
                    user_id int(11) NOT NULL,
                    login_time datetime NOT NULL,
                    logout_time datetime DEFAULT NULL,
                    PRIMARY KEY (log_id),
                    KEY user_id (user_id),
                    CONSTRAINT user_logs_ibfk_1 FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
            `);
            console.log('User logs table verified');

        } catch (err) {
            console.error('Error initializing database:', err);
        }
    }

    initDb();
});

app.use(express.json());
app.use(cookieParser());

// Serve static files from Client directory
app.use('/Client', express.static(path.join(__dirname, 'Client')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Serve product images
app.use('/admin/product/images', express.static(path.join(__dirname, 'admin/product/images')));

// Redirect root URL to Client/index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Client/index.html'));
});

// Serve the product page
app.get('/Client/product/product.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Client/product/product.html'));
});

// Serve the about page
app.get('/Client/about-us/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Client/about-us/about.html'));
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
    console.log('Login attempt for username:', username);
    
    db.query('SELECT * FROM users WHERE username = ? ', [username], async (err, result) => {
        if (err) {
            console.error('Database error during user lookup:', err);
            return res.status(500).send('Server Error')
        }
        if (result.length == 0) {
            console.log('No user found with username:', username);
            return res.status(401).send('Invalid credentials')
        }
        const user = result[0];
        console.log('User found:', { id: user.user_id, username: user.username, role: user.role });
        
        // Compare password
        bcrypt.compare(password, user.password, async (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(401).send('Invalid credentials')
            }
            if (!isMatch) {
                console.log('Password mismatch for user:', username);
                return res.status(401).send('Invalid credentials')
            }
            
            console.log('Password match, generating token...');
            // Generate JWT token with role
            const token = jwt.sign(
                {
                    id: user.user_id,
                    username: user.username,
                    role: user.role
                }, 
                secretKey, 
                {expiresIn: '1h'}
            );
            
            try {
                // Log the user login with user_id
                console.log('Attempting to log login for user_id:', user.user_id);
                const logResult = await logUserLogin(user.user_id);
                console.log('Login logged successfully, log ID:', logResult);
                
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
                        redirectUrl: '/Client/index.html'
                    });
                }
            } catch (error) {
                console.error('Detailed error logging user login:', error);
                // Still allow login even if logging fails
                res.json({
                    success: true,
                    message: 'Logged in successfully but failed to log activity',
                    redirectUrl: user.role === 'admin' ? '/admin/index.html' : '/client/index.html'
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
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                res.clearCookie('token');
                return res.status(401).json({ error: 'Token expired' });
            }
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

function requireAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access required' });
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
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
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
            db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
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
    console.log('Received request for products');
    
    db.query('SELECT * FROM product', (err, results) => {
        if (err) {
            console.error('Error fetching products from database:', err);
            console.error('Error code:', err.code);
            console.error('Error message:', err.message);
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: err.message,
                code: err.code 
            });
        }

        console.log('Successfully fetched products:', results);
        
        if (!results || !Array.isArray(results)) {
            console.error('Invalid results format:', results);
            return res.status(500).json({ error: 'Invalid data format from database' });
        }

        res.json(results);
    });
});

app.post('/api/products', authenticateToken, requireAdmin, (req, res) => {
    const { title, image, price, description } = req.body;
    
    if (!title || !image || !price || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = 'INSERT INTO product (title, image, price, description, out_of_order) VALUES (?, ?, ?, ?, false)';
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

// Function to log user login
async function logUserLogin(userId) {
    console.log('logUserLogin called with userId:', userId);
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO user_logs (user_id, login_time) VALUES (?, NOW())';
        console.log('Executing query:', query, 'with userId:', userId);
        
        db.query(query, [userId], (err, result) => {
            if (err) {
                console.error('Database error in logUserLogin:', err);
                reject(err);
            } else {
                console.log('Login logged successfully:', result);
                resolve(result.insertId);
            }
        });
    });
}

// Function to log user logout
async function logUserLogout(userId) {
    console.log('logUserLogout called with userId:', userId);
    return new Promise((resolve, reject) => {
        const query = 'UPDATE user_logs SET logout_time = NOW() WHERE user_id = ? AND logout_time IS NULL';
        console.log('Executing query:', query, 'with userId:', userId);
        
        db.query(query, [userId], (err, result) => {
            if (err) {
                console.error('Database error in logUserLogout:', err);
                reject(err);
            } else {
                console.log('Logout logged successfully:', result);
                resolve(result.affectedRows > 0);
            }
        });
    });
}

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const [rows] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.user_id, username: user.username, role: user.role },
            secretKey,
            { expiresIn: '1h' }
        );
        
        // Log the login
        await logUserLogin(user.user_id);
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
        
        res.json({
            message: 'Login successful',
            user: { id: user.user_id, username: user.username, role: user.role }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout endpoint
app.post('/api/logout', authenticateToken, async (req, res) => {
    try {
        // Log the logout
        await logUserLogout(req.user.id);
        
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add new drink endpoint
app.post('/api/products/add', upload.single('image'), (req, res) => {
    console.log('Received request body:', req.body); // Debug log
    console.log('Received file:', req.file); // Debug log

    const { title, price, description } = req.body;
    const image = `/admin/product/images/${req.file.originalname}`;
    
    console.log('Received data:', { title, price, description, image }); // Debug log
    
    if (!title || !price || !description || !req.file) {
        console.log('Missing fields:', { 
            hasTitle: !!title, 
            hasPrice: !!price, 
            hasDescription: !!description, 
            hasFile: !!req.file 
        }); // Debug log
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
// Delete product endpoint
app.delete('/api/products/delete/:title', authenticateToken, requireAdmin, async (req, res) => {
    const title = req.params.title;
    console.log('Delete request received for product:', title); // Debug log
    console.log('User:', req.user); // Debug log
    
    try {
        // First, get the product to find its image path
        const [product] = await db.promise().query('SELECT image FROM product WHERE title = ?', [title]);
        console.log('Found product:', product); // Debug log
        
        if (product.length === 0) {
            console.log('Product not found in database'); // Debug log
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete the product from database
        const [result] = await db.promise().query('DELETE FROM product WHERE title = ?', [title]);
        console.log('Delete result:', result); // Debug log
        
        if (result.affectedRows === 0) {
            console.log('No rows affected by delete'); // Debug log
            return res.status(404).json({ error: 'Product not found' });
        }

        // Try to delete the image file
        const imagePath = path.join(__dirname, product[0].image);
        console.log('Attempting to delete image at:', imagePath); // Debug log
        try {
            fs.unlinkSync(imagePath);
            console.log('Image file deleted successfully'); // Debug log
        } catch (err) {
            console.error('Error deleting image file:', err);
            // Continue even if image deletion fails
        }

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product: ' + error.message });
    }
});

app.listen(PORT,() => {console.log(`Server Running at http://localhost:${PORT}`);})
