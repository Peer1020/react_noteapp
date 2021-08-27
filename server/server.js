const express = require('express');
const bodyParser = require('body-parser');
const path=require('path');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())


// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

//app.use(express.static("src"));


// Require Notes routes
require('./app/routes/note.routes.js')(app);

// listen for requests
app.listen(5000, () => {
    console.log("Server is listening on port 5000");
});

module.exports = app;