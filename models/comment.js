const Schema = require('mongoose').Schema;
const db = require('../config/db');

const Comment = db.model('Comment', new Schema({
    username: String,

    text: String,

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

module.exports = Comment;