/**
 * This schema represents movies in our application. Each movie has a title,
 * director, release year, description, image URL, average rating, and rating count.
 * We also index the 'title' and 'director' fields to optimize search queries based on these attributes.
 */

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

    releaseYear: {
        type: Number,
        min: [1900, 'Movie must be released after 1900'],
        max: [new Date().getFullYear(), 'Movie cannot be released from the future']
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


// Index to optimize search queries based on title and director
movieSchema.index({title: 1, director: 1});

const Movie = db.model('Movie', movieSchema);

module.exports = Movie;