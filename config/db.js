const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/S8F7DV');

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
})

module.exports = mongoose;
