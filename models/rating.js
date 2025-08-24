const Schema = require('mongoose').Schema;
const db = require('../config/db');

const ratingSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
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
});

const Rating = db.model('Rating', ratingSchema);

module.exports = Rating;
