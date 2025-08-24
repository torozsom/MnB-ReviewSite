/**
 * Setting up the express web application
 * and the necessary configurations
 */

// Import required modules
const express = require('express');
const path = require('path');
const app = express();

require('dotenv').config();

// Configure middlewares
app.use(express.urlencoded({extended: true}));
const sessionMW = require('./config/session');
app.use(sessionMW);

// Configure view engine and static files
app.set("view engine", "ejs");
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));

// Set up routes
const subscribeToRoutes = require('./routing/routing');
subscribeToRoutes(app);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});
