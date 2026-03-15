/**
 * This schema represents books in our application. Each book has a title,
 * author, release year, description, image URL, average rating, and rating count.
 * We also index the 'title' and 'author' fields to optimize search queries based on
 * these attributes.
 */

const Schema = require('mongoose').Schema;
const db = require('../config/db');


const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 200
    },

    author: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },

    releaseYear: {
        type: Number,
        min: [1800, 'Book must be published after 1800'],
        max: [new Date().getFullYear(), 'Book cannot be published from the future']
    },

    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 1000
    },

    imageUrl: {
        type: String,
        default: '/placeholder.png'
    },

    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    ratingCount: {
        type: Number,
        default: 0,
        min: 0
    }
}, {timestamps: true});


// Index to optimize search queries based on title and author
bookSchema.index({title: 1, author: 1});

const Book = db.model('Book', bookSchema);

module.exports = Book;
