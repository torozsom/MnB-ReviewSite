/**
 * This schema represents users in our application. Each user has a username, email, and password.
 * We also use a pre-save hook to hash the password before saving the user document to the database.
 * We also index the 'username' field to ensure uniqueness and optimize queries by username.
 */

const Schema = require('mongoose').Schema;
const db = require('../config/db');
const bcrypt = require('bcrypt');


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    }
});

// Pre-save hook to hash the password before saving the user document
userSchema.pre('save', function (next) {
    if (!this.isModified('password'))
        return next();

    bcrypt.hash(this.password, 10)
        .then(hashedPassword => {
            this.password = hashedPassword;
            next();
        })
        .catch(next);
});

// Index to ensure uniqueness of username and optimize queries by username
userSchema.index({username: 1}, {unique: true});

const User = db.model('User', userSchema);

module.exports = User;
