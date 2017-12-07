const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
var mongodb = require('./config/mongo.db');
var config = require('./config/env/env');

const app = express();

const users = require('./routes/users');
const threads = require('./routes/threads');
const comments = require('./routes/comments');

app.set('port', (process.env.PORT || config.env.webPort));
app.set('env', (process.env.ENV || 'development'));

//Middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

// CORS headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || 'http://localhost:4200');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

//Routes
app.use('/api/v1/users', users);
app.use('/api/v1/threads', threads);
app.use('/api/v1/comments', comments);

//Catch Errors
app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

//Error Handler
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    res.status(status).json({
        error: {
            message: error.message
        }
    });

    console.error(err);
});

// Fallback
app.use('*', function (req, res) {
    res.status(400);
    res.json({
        'error': 'No such URL'
    });
});

//Main
app.listen(config.env.webPort, function () {
    console.log('De server luistert op port ' + app.get('port'));
    console.log('Zie bijvoorbeeld http://localhost:3000/api/v1/users');
});

module.exports = app;
