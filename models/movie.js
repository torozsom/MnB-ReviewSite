const Schema = require('mongoose').Schema;
const db = require('../config/db');

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 200
    },

    director: {
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

movieSchema.index({ title: 1 });
movieSchema.index({ director: 1 });

const Movie = db.model('Movie', movieSchema);

module.exports = Movie;