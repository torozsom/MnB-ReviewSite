/**
 * Application routing configuration
 * Defines all routes and their associated middleware
 */

// Load middleware modules
// Content loading middleware
const loadBooksMW = require('../middlewares/loadBooks.js');
const loadMoviesMW = require('../middlewares/loadMovies');
const loadItemMW = require('../middlewares/loadItem');

// Authentication middleware
const authMW = require('../middlewares/auth');
const loginMW = require('../middlewares/login');
const registerMW = require('../middlewares/register');
const logoutMW = require('../middlewares/logout');

// Rendering middleware
const renderMW = require('../middlewares/render');

// Data manipulation middleware
const deleteItemMW = require('../middlewares/deleteItem');
const saveBookMW = require('../middlewares/saveBook');
const saveMovieMW = require('../middlewares/saveMovie');
const saveCommentMW = require('../middlewares/saveComment');
const saveRatingMW = require('../middlewares/saveRating');

const fileUpload = require('../config/upload');

// Load models
const BookModel = require('../models/book');
const MovieModel = require('../models/movie');
const CommentModel = require('../models/comment');
const UserModel = require('../models/user');
const RatingModel = require('../models/rating');

// Create object repository for middleware
const objRepo = {BookModel, MovieModel, CommentModel, UserModel, RatingModel};

/**
 * Sets up all application routes
 * @param {Express} app - Express application instance
 */
function subscribeToRoutes(app) {
    // Home and listing routes
    app.get('/', loadMoviesMW(objRepo), renderMW(objRepo, 'index', {
        title: 'Home Page',
        stylesheet: '/custom.css',
        showNav: true
    }));

    app.get('/movies', loadMoviesMW(objRepo), renderMW(objRepo, 'index', {
        title: 'Home Page',
        stylesheet: '/custom.css',
        showNav: true
    }));

    app.get('/books', loadBooksMW(objRepo), renderMW(objRepo, 'index', {
        title: 'Home Page',
        stylesheet: '/custom.css',
        showNav: true
    }));

    // Authentication routes
    app.get('/register', renderMW(objRepo, 'register', {
        title: 'Register',
        stylesheet: '/custom.css',
        showNav: false
    }));
    app.post('/register', registerMW(objRepo));

    app.get('/login', renderMW(objRepo, 'login', {
        title: 'Login',
        stylesheet: '/custom.css',
        showNav: false
    }));
    app.post('/login', loginMW(objRepo));

    app.get('/logout', logoutMW(objRepo));

    // Item management routes
    app.get('/add', authMW(objRepo), renderMW(objRepo, 'add', {
        title: 'Add Item',
        stylesheet: '/custom.css',
        showNav: false
    }));
    app.post('/add', authMW(objRepo), fileUpload.single('image'), saveBookMW(objRepo), saveMovieMW(objRepo), (req, res) => {
        res.redirect('/');
    });

    app.get('/details/:id', loadItemMW(objRepo), renderMW(objRepo, 'details', {
        title: 'Details',
        stylesheet: '/custom.css',
        showNav: false
    }));

    app.get('/edit/:id', authMW(objRepo), loadItemMW(objRepo), renderMW(objRepo, 'edit', {
        title: 'Edit Item',
        stylesheet: '/custom.css',
        showNav: false
    }));
    app.post('/edit/:id', authMW(objRepo), fileUpload.single('image'), saveBookMW(objRepo), saveMovieMW(objRepo), (req, res) => {
        res.redirect('/');
    });

    app.get('/delete/:id', authMW(objRepo), deleteItemMW(objRepo));

    // Interaction routes
    app.post('/comment/:id', authMW(objRepo), saveCommentMW(objRepo), (req, res) => {
        res.redirect('/details/' + req.params.id);
    });

    app.post('/rate/:id', authMW(objRepo), saveRatingMW(objRepo), (req, res) => {
        res.redirect('/details/' + req.params.id);
    });

    // Error handling
    app.use((err, req, res, next) => {
        console.log('Error:', err);
        res.end('An error occurred');
    });
}

module.exports = subscribeToRoutes;
