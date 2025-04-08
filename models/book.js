const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Book = db.model('Book', new Schema({
    title: String,
    author: String,
    releaseYear: Number,
    description: String
}));

module.exports = Book;