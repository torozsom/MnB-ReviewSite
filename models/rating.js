const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Rating = db.model('Rating', new Schema({
    username: String,

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    date: Date,

    _assignedTo: {
        type: Schema.Types.ObjectId,
        refPath: 'onModel'
    },

    onModel: {
        type: String,
        required: true,
        enum: ['Movie', 'Book']
    }
}));

module.exports = Rating;