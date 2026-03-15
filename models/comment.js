/**
 * This schema represents comments made by users on movies or books. Each comment is associated
 * with a user and either a movie or a book. The 'refPath' allows us to reference different models
 * (Movie or Book) based on the value of 'onModel'. We also index the '_assignedTo' field along with
 * 'createdAt' to optimize queries that retrieve comments for a specific movie or book, sorted by creation date.
 */

const Schema = require('mongoose').Schema;
const db = require('../config/db');


const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 1000
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


// Index to optimize queries for comments related to a specific movie or book, sorted by creation date
commentSchema.index({_assignedTo: 1, createdAt: -1});

const Comment = db.model('Comment', commentSchema);

module.exports = Comment;
