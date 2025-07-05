const Schema = require('mongoose').Schema;
const db = require('../config/db');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: String,

    email: String,

    password: String
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();

    try {
        const SALT_ROUNDS = 10;
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
        next();
    } catch (err) {
        next(err);
    }
});

const User = db.model('User', userSchema);

module.exports = User;