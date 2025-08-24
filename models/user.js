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

userSchema.pre('save', function(next) {
    if (!this.isModified('password'))
        return next();

    bcrypt.hash(this.password, 10)
        .then(hashedPassword => {
            this.password = hashedPassword;
            next();
        })
        .catch(next);
});

const User = db.model('User', userSchema);

module.exports = User;
