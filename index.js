// Import required modules
const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

// Configure middleware
app.use(express.urlencoded({extended: true}));

// Configure session
app.use(session({
    secret: 'review-site-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}));

// Configure view engine and static files
app.set("view engine", "ejs");
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));

// Set up routes
const subscribeToRoutes = require('./routing/routing');
subscribeToRoutes(app);

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
