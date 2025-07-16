const Schema = require('mongoose').Schema;
const db = require('../config/db');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: String,

    email: String,

    password: String
})

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