const loadBooksMW = require('../middlewares/loadBooks.js');
const loadMoviesMW = require('../middlewares/loadMovies');
const loadItemMW = require('../middlewares/loadItem');
const authMW = require('../middlewares/auth');
const renderMW = require('../middlewares/render');

const loginMW = require('../middlewares/login');
const registerMW = require('../middlewares/register');
const logoutMW = require('../middlewares/logout');
const deleteItemMW = require('../middlewares/deleteItem');
const saveItemMW = require('../middlewares/saveItem');
const saveReviewMW = require('../middlewares/saveReview');


const objRepo = {};

function subscribeToRoutes(app) {
    app.get('/', loadMoviesMW(objRepo), renderMW(objRepo));
    app.get('/movies', loadMoviesMW(objRepo), renderMW(objRepo));
    app.get('/books', loadBooksMW(objRepo), renderMW(objRepo));
    app.get('/login', renderMW(objRepo));
    app.get('/register', renderMW(objRepo));
    app.get('/add', authMW(objRepo), renderMW(objRepo));
    app.get('/details/:id', loadItemMW(objRepo), renderMW(objRepo));
    app.get('/add', authMW(objRepo), renderMW(objRepo));
    app.get('/edit/:id', authMW(objRepo), loadItemMW(objRepo), renderMW(objRepo));
}

module.exports = subscribeToRoutes;