const express = require('express');
const mysql = require('mysql2'); // Using mysql2 for better compatibility
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session'); // Import express-session

const app = express();
const port = 3000;

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: 'MYSQLPASSWORD', // Your MySQL password
  database: 'organ_donation_system', // Your MySQL database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Set up EJS and body-parser
app.set('view engine', 'ejs'); // View engine for rendering EJS files
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies

// Set up session middleware
app.use(
  session({
    secret: 'your-secret-key', // Change this to a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }, // Session expires in 60 seconds (adjust as needed)
  })
);

// Serve static files (CSS, images, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Default admin credentials
const adminCredentials = {
  username: 'admin',
  password: 'password123',
};

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.session.isLoggedIn) {
    return next();
  }
  res.redirect('/admin'); // Redirect to login page if not authenticated
}

// Routes
app.get('/', (req, res) => {
  res.render('index'); // Render the main page
});

// Route to display "Add Donor" form
app.get('/add-donor', (req, res) => {
  res.render('add_donor'); // Render the add_donor.ejs file
});

// Route to handle donor form submission
app.post('/add-donor', (req, res) => {
  const { name, age, blood_group, organ_donated, contact_number, email, address, donation_date } = req.body;

  const query = 'INSERT INTO donors (name, age, blood_group, organ_donated, contact_number, email, address, donation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [name, age, blood_group, organ_donated, contact_number, email, address, donation_date], (err, result) => {
    if (err) {
      console.error('Error while inserting donor:', err);
      res.send('Error while inserting donor');
    } else {
      res.send('Donor added successfully');
    }
  });
});

// Route to display "Add Recipient" form
app.get('/add-recipient', (req, res) => {
  res.render('add_recipient'); // Render the add_recipient.ejs file
});

// Route to handle recipient form submission
app.post('/add-recipient', (req, res) => {
  const { name, age, blood_group, organ_required, contact_number, email, address, registration_date } = req.body;

  const query = 'INSERT INTO recipients (name, age, blood_group, organ_required, contact_number, email, address, registration_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [name, age, blood_group, organ_required, contact_number, email, address, registration_date], (err, result) => {
    if (err) {
      console.error('Error while inserting recipient:', err);
      res.send('Error while inserting recipient');
    } else {
      res.send('Recipient added successfully');
    }
  });
});

// Admin login page (unprotected)
app.get('/admin', (req, res) => {
  res.render('admin_login', { error: null }); // Render the admin login page
});

// Handle admin login
app.post('/admin', (req, res) => {
  const { username, password } = req.body;

  if (username === adminCredentials.username && password === adminCredentials.password) {
    req.session.isLoggedIn = true; // Set session logged-in status
    res.redirect('/admin/dashboard'); // Redirect to admin dashboard
  } else {
    res.render('admin_login', { error: 'Invalid username or password' });
  }
});

// Admin dashboard to view donor and recipient details (protected route)
app.get('/admin/dashboard', isAuthenticated, (req, res) => {
  const donorQuery = 'SELECT * FROM donors';
  const recipientQuery = 'SELECT * FROM recipients';

  // Fetch both donors and recipients
  db.query(donorQuery, (donorErr, donors) => {
    if (donorErr) {
      console.error('Error fetching donors:', donorErr);
      return res.send('Error fetching donors');
    }

    db.query(recipientQuery, (recipientErr, recipients) => {
      if (recipientErr) {
        console.error('Error fetching recipients:', recipientErr);
        return res.send('Error fetching recipients');
      }

      // Render admin dashboard with donors and recipients
      res.render('admin_dashboard', { donors, recipients });
    });
  });
});

// Logout route to end the session
app.get('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.send('Error logging out');
    }
    res.redirect('/admin'); // Redirect to login page
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use(express.static(path.join(__dirname, 'public')));

