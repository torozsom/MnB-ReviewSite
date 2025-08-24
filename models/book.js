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

    releaseYear: Number,

    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 1000
    },

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
});

bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });

const Book = db.model('Book', bookSchema);

module.exports = Book;
