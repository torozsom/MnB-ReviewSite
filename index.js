const express = require('express');
const path = require('path');
const app = express();

app.set("view engine", "ejs");
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));

const subscribeToRoutes = require('./routing/routing');
subscribeToRoutes(app);


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

