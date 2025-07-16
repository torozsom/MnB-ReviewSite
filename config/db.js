/**
 * Establishing the connection with the
 * MongoDB database
 */

const mongoose = require('mongoose');

async function connectToDB (){
    try {
        await mongoose.connect('mongodb://localhost/S8F7DV');
        console.log('\'✅  MongoDB connected\'');
    } catch (err) {
        console.error('❌  MongoDB error', err);
    }
}

connectToDB();

module.exports = mongoose;
