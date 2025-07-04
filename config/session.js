/**
 * Configuring the session management of the project
 * that stores the session info to the db
 */

const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const sessionConfig = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 60 * 60,
        autoRemove: 'native'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000
    }
});

module.exports = sessionConfig;