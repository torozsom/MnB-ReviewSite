const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Book = db.model('Book', new Schema({
    title: String,

    author: String,

    releaseYear: Number,

    description: String,

    image: {
        data: Buffer,
        contentType: String
    },

    averageRating: {
        type: Number,
        default: 0
    },

    ratingCount: {
        type: Number,
        default: 0
    }
}));

module.exports = Book;
