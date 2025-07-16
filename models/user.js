const Schema = require('mongoose').Schema;
const db = require('../config/db');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: String,

    email: String,

    password: String
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password'))
        return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        return next();
    } catch (err) {
        return next(err);
    }
});

const User = db.model('User', userSchema);

module.exports = User;