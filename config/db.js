/**
 * Establishing the connection with the
 * MongoDB database
 */

const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || 'mongodb://localhost/S8F7DV';
if (!process.env.MONGO_URI)
    console.warn('⚠️  MONGO_URI environment variable not set. Using default URI.');

mongoose.connect(uri)
    .then(() => console.log('✅  MongoDB connected'))
    .catch(err => console.error('❌  MongoDB error', err));

module.exports = mongoose;
