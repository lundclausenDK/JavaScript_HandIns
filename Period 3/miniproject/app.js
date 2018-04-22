require("./dbSetup");
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const login = require('./routes/login');

const userFacade = require('./facade/userFacade');
const loginFacade = require('./facade/loginFacade');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', index);
app.use('/users', users);
app.use('/login', login);

// REST API
// Users
app.get("/api/users/", function(req, res) {
    res.json(userFacade.getAllUsers());
});

app.get('/api/users/:user_name', function(req, res) {
    res.json(userFacade.findByUserName(res));
});

app.post('/api/users/', function(req, res) {
    userFacade.addUser(req.body);
});

// Login
app.get("/api/login/", loginFacade.getAllLogins);
app.post('/api/login/', loginFacade.login);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, function() {
    console.log("Ready");
});


module.exports = app;
