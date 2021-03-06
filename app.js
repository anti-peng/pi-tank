var express     = require('express');
var routes      = require('./routes');
var http        = require('http');
var gpio 		= require('pi-gpio');
var async 		= require('async');
var path 		= require('path');

var app = express();

app.set('port', 3000);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);


// gpio init (close all pins)
var pins = [11, 12, 15, 16];
closePins(pins, function(){
	console.log('-- done init all pins --');
});

// SIGINT
process.on('SIGINT', function(){
	closePins(pins, function(){
		console.log('-- all pins closed --');
		console.log('-- process exit --');
		process.exit(0);
	});
});

function closePins(pins, callback){
	// ignore errors
	async.each(pins, function(pin, cb){
		gpio.close(pin, cb);
	}, callback);	
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('-- Express server listening on port ' + app.get('port') + ' --');
});