const express = require('express');
const path = require('path');

const app = express();

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

// Serve index.html (homepage)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve details.html (item details page)
app.get('/details', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'details.html'));
});

app.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'add.html'));
});


app.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'edit.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
