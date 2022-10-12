const mongoose = require('mongoose');

// Db connection

mongoose.connect('mongodb://localhost/plush')

const db = mongoose.connection;

db.on('err', console.error.bind(console, 'db not connected'));

db.once('open', function(err) {
    if (err) {
        console.log('db is not connected');
        return false;
    }
    console.log('db is connected successfully');
});