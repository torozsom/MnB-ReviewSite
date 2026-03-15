/**
 * Configuring the session management of the project
 * that stores the session info to the db
 */

const session = require('express-session');
const MongoStore = require('connect-mongo');

if (!process.env.SESSION_SECRET) {
    console.error('SESSION_SECRET environment variable is not set');
    process.exit(1);
}

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost/MnB-ReviewSite';

const rawTtl = Number(process.env.SESSION_DURATION);

if (Number.isNaN(rawTtl))
    console.warn('SESSION_DURATION is not a valid number, defaulting to 3600 seconds');

const ttl = Number.isNaN(rawTtl) ? 3600 : rawTtl;

const sessionConfig = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongoUri,
        ttl: ttl,
        autoRemove: 'native'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: ttl * 1000
    }
});

module.exports = sessionConfig;
