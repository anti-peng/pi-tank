var async 	= require('async');
var config 	= require('../config');
var gpio 	= require('pi-gpio');

var pins = [11, 12, 15, 16];

var forward = [
	{pin: 11, dir: 1},
	{pin: 12, dir: 0},
	{pin: 15, dir: 1},
	{pin: 16, dir: 0}
];
var backward = [
	{pin: 11, dir: 0},
	{pin: 12, dir: 1},
	{pin: 15, dir: 0},
	{pin: 16, dir: 1}
];
var left = [
	{pin: 11, dir: 1},
	{pin: 12, dir: 0},
	{pin: 15, dir: 0},
	{pin: 16, dir: 0}
];
var right = [
	{pin: 11, dir: 0},
	{pin: 12, dir: 0},
	{pin: 15, dir: 1},
	{pin: 16, dir: 0}
];
var stop = [
	{pin: 11, dir: 0},
	{pin: 12, dir: 0},
	{pin: 15, dir: 0},
	{pin: 16, dir: 0}
];

module.exports = function(app){

	/* power up */
	app.get('/on', function(req, res){
		openPins(pins, 'out', function(err){
			if(err) throw err;
			res.json(null);
		})
	});

	/* power off */
	app.get('/off', function(req, res){
		closePins(pins, function(err){
			if(err) throw err;
			res.json(null);
		})
	});	

	// forward
	app.get('/forward', function(req, res){
		tankGo(forward, function(err){
			if(err) throw err;
			res.json(null);
		})
	});

	// backward
	app.get('/backward', function(req, res){
		tankGo(backward, function(err){
			if(err) throw err;
			res.json(null);
		})
	});

	// left
	app.get('/left', function(req, res){
		tankGo(left, function(err){
			if(err) throw err;
			res.json(null);
		})
	});

	// right
	app.get('/right', function(req, res){
		tankGo(right, function(err){
			if(err) throw err;
			res.json(null);
		})
	});

	// stop
	app.get('/stop', function(req, res){
		tankGo(stop, function(err){
			if(err) throw err;
			res.json(null);
		})
	});
}

//
function tankGo(direction, callback){
	async.each(direction, function(obj, cb){
		gpio.write(obj.pin, obj.dir, function(err){
			if(err) return cb(err);
			cb();
		});
	}, callback);
}

// 关闭引脚 [pins]
function closePins(pins, callback){
	async.each(pins, function(pin, cb){
		gpio.close(pin, function(err){
			// ignore error
			cb();
		})
	}, callback);
}

// 打开引脚 [pins], option: in / out
function openPins(pins, option, callback){
	async.each(pins, function(pin, cb){
		gpio.open(pin, option, function(err){
			if(err) return cb(err);
			cb();
		})
	}, callback);
}