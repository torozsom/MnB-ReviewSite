const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Movie = db.model('Movie', new Schema({
    title: String,

    producer: String,

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

module.exports = Movie;
