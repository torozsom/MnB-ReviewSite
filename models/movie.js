const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Movie = db.model('Movie', new Schema({
    title: String,
    producer: String,
    releaseYear: Number,
    description: String
}));

module.exports = Movie;