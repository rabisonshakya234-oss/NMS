var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

require('./config/db')(); // connect to MongoDB

var app = express();
app.use(require('helmet')({ contentSecurityPolicy: { directives: { 'upgrade-insecure-requests': null } } })); // security headers (the null keeps http://localhost working in Safari)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api', require('./routes/api'));
require('./service/reminderService').startScheduler(); // emails due reminders
app.use(require('./utils/errorHandler').errorHandler);

module.exports = app;
