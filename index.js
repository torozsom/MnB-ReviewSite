const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'review-site-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}));

app.set("view engine", "ejs");
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));

const subscribeToRoutes = require('./routing/routing');
subscribeToRoutes(app);


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
