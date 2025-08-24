const Schema = require('mongoose').Schema;
const db = require('../config/db');

const commentSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },

    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 1000
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

const Comment = db.model('Comment', commentSchema);

module.exports = Comment;
