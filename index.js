const express = require('express');
const port = 2001;
const path = require('path');
const db = require('./config/mongoose');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const customWare = require('./middlewares/flash');

// For view ejs pages

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.locals.moment = require('moment');

app.use(session({
    name: "Zenil",
    secret: "something",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

// To show flash message 

app.use(flash());
app.use(customWare.setFlash);

app.use(express.urlencoded());
app.use('/', require('./routes'));

app.listen(port, function(err) {
    if (err) {
        console.log("Something Went Wrong");
        return;
    }
    console.log("Server Is Running On Port:", port)
});