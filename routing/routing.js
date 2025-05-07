const loadBooksMW = require('../middlewares/loadBooks.js');
const loadMoviesMW = require('../middlewares/loadMovies');
const loadItemMW = require('../middlewares/loadItem');
const authMW = require('../middlewares/auth');
const renderMW = require('../middlewares/render');

const loginMW = require('../middlewares/login');
const registerMW = require('../middlewares/register');
const logoutMW = require('../middlewares/logout');
const deleteItemMW = require('../middlewares/deleteItem');
const saveBookMW = require('../middlewares/saveBook');
const saveMovieMW = require('../middlewares/saveMovie');
const saveCommentMW = require('../middlewares/saveComment');
const saveRatingMW = require('../middlewares/saveRating');

const multer = require('multer');
const storage = multer.memoryStorage(); // Store in memory before saving to DB
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024}, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/'))
            cb(null, true);
        else
            cb(new Error('Only images are allowed'), false);
    }
});

const BookModel = require('../models/book');
const MovieModel = require('../models/movie');
const CommentModel = require('../models/comment');
const UserModel = require('../models/user');
const RatingModel = require('../models/rating');

const objRepo = {BookModel, MovieModel, CommentModel, UserModel, RatingModel};


function subscribeToRoutes(app) {

    app.get('/', loadMoviesMW(objRepo), renderMW(objRepo, 'index', {
        title: 'Home Page',
        stylesheet: '/styles.css',
        showNav: true
    }));

    app.get('/movies', loadMoviesMW(objRepo), renderMW(objRepo, 'index', {
        title: 'Home Page',
        stylesheet: '/styles.css',
        showNav: true
    }));

    app.get('/books', loadBooksMW(objRepo), renderMW(objRepo, 'index', {
        title: 'Home Page',
        stylesheet: '/styles.css',
        showNav: true
    }));

    app.get('/register', renderMW(objRepo, 'register', {
        title: 'Register',
        stylesheet: '/auth.css',
        showNav: false
    }));

    app.post('/register', registerMW(objRepo));

    app.get('/login', renderMW(objRepo, 'login', {
        title: 'Login',
        stylesheet: '/auth.css',
        showNav: false
    }));

    app.post('/login', loginMW(objRepo));

    app.get('/logout', logoutMW(objRepo));

    app.get('/add', authMW(objRepo), renderMW(objRepo, 'add', {
        title: 'Add Item',
        stylesheet: '/add.css',
        showNav: false
    }));

    app.post('/add', authMW(objRepo), upload.single('image'), saveBookMW(objRepo), saveMovieMW(objRepo), (req, res) => {
        res.redirect('/');
    });

    app.get('/details/:id', loadItemMW(objRepo), renderMW(objRepo, 'details', {
        title: 'Details',
        stylesheet: '/details.css',
        showNav: false
    }));

    app.get('/edit/:id', authMW(objRepo), loadItemMW(objRepo), renderMW(objRepo, 'edit', {
        title: 'Edit Item',
        stylesheet: '/edit.css',
        showNav: false
    }));

    app.post('/edit/:id', authMW(objRepo), upload.single('image'), saveBookMW(objRepo), saveMovieMW(objRepo), (req, res) => {
        res.redirect('/');
    });

    app.post('/comment/:id', authMW(objRepo), saveCommentMW(objRepo), (req, res) => {
        res.redirect('/details/' + req.params.id);
    });

    app.post('/rate/:id', authMW(objRepo), saveRatingMW(objRepo), (req, res) => {
        res.redirect('/details/' + req.params.id);
    });

    app.get('/delete/:id', authMW(objRepo), deleteItemMW(objRepo));

    app.use((err, req, res, next) => {
        console.log('Error:', err);
        res.end('An error occurred');
    });
}

module.exports = subscribeToRoutes;
