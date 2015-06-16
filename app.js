var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var routes = require('./routes/index');
var session = require('express-session');
var hora = require('moment');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
// app.use(session());
app.use(session({
    secret: 'Quiz 2015',
    name: 'quiz_secret',
    store: '', 
    proxy: true,
    resave: true,
    saveUninitialized: true
}));


app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos
app.use(function(req, res, next){
	
	// Guardar path en session.redir para despues de login
	if (!req.path.match(/\/login|\/logout/)) {
		req.session.redir = req.path;
	}
		
	// Hacer visible req.session en las vistas
	res.locals.session = req.session;
	next();
});

// app.use('/', routes);

app.use('/', function(req, res, next){
	var ahora = new Date();
	var hora_sesion = req.session.time ? new Date(req.session.time) : new Date();
	
	if (!req.path.match(/\/login|\/logout/)) {
		// Comprobamos que el tiempo desde la ultima peticion es mayor de 2 minutos
		if ((ahora.getMinutes() - 2) > hora_sesion.getMinutes()) {
			console.log('***** SESION EXPIRADA ***');	
			var errors = req.session.errors || 'La sesión ha expirado.';
			req.session.errors = {};
			res.render('sessions/new', {errors: errors});
		} else {
			// refrescamos el contador de tiempo con la peticion más reciente
			console.log('############### LA SESION SE HA REFRESCADO ################');	
			req.session.time = new Date();
			next(); 
		}
	} else {
		next(); 
	}
	
	console.log('***** HORA INICIO SESION: ' + hora_sesion);	
	console.log('***** HORA ACTUAL: ' + ahora);	
	
}, routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
	  errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
	errors: []
  });
});


module.exports = app;
