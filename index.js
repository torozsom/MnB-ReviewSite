const express = require('express');
const path = require('path');
const app = express();


const subscribeToRoutes = require('./routing/routing');
subscribeToRoutes(app);


app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.get('/details', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'details.html'));
});


app.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'add.html'));
});


app.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'edit.html'));
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

