/**
 * This schema represents ratings given by users to movies or books. Each rating is associated with
 * a user and either a movie or a book. The 'refPath' allows us to reference different models
 * (Movie or Book) based on the value of 'onModel'. We also index the 'user' and '_assignedTo' fields
 * to optimize queries that retrieve ratings for a specific movie or book by a specific user.
 */

const Schema = require('mongoose').Schema;
const db = require('../config/db');


const ratingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    _assignedTo: {
        type: Schema.Types.ObjectId,
        refPath: 'onModel',
        required: true
    },

    onModel: {
        type: String,
        required: true,
        enum: ['Movie', 'Book']
    }
}, {timestamps: true});


// Index to optimize queries for ratings related to a specific movie or book, sorted by creation date
ratingSchema.index({user: 1, _assignedTo: 1});

const Rating = db.model('Rating', ratingSchema);

module.exports = Rating;
