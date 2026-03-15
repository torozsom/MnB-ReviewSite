/**
 * Establishing the connection with the
 * MongoDB database
 */

const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || 'mongodb://localhost/MnB-ReviewSite';
if (!process.env.MONGO_URI)
    console.warn('⚠️  MONGO_URI environment variable not set. Using default URI.');

mongoose.connect(uri)
    .then(() => console.log('✅  MongoDB connected'))
    .catch(err => {
        console.error('❌  MongoDB error', err);
        process.exit(1);
    });

process.on('SIGINT', () => {
    mongoose.connection.close()
        .then(() => {
            console.log('✅  MongoDB connection closed');
            process.exit(0);
        })
        .catch(err => {
            console.error('❌  Error closing MongoDB connection', err);
            process.exit(1);
        });
    });


module.exports = mongoose;
