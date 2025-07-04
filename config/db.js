/**
 * Establishing the connection with the
 * MongoDB database
 */

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/S8F7DV')
    .then(() => console.log('✅  MongoDB connected'))
    .catch(err => console.error('❌  MongoDB error', err));

module.exports = mongoose;
