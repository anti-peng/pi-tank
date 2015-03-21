var gpio = require('pi-gpio');
var async = require('async');

// GPIO 17, 18, 22, 23
// IN1 ~ IN4
// var pins = [11, 12, 15, 16];
var pins = [11, 12];

// 打开引脚
async.auto({
	// 0 close pins
	closePins: function(cb){
		closePins(pins, cb);
	},
	// 1 打开GPIO引脚
	turnPinsOn: ['closePins', function(cb){
		openPins(pins, 'output', cb);
	}],
	// 2 引脚电平输出
	setDirection1: ['turnPinsOn', function(cb){
		setDirection([11], 1, cb);
	}],
	setDirection2: ['setDirection1', function(cb){
		setDirection([12], 0, cb);
	}],
	// 3 翻转电平
	overturnDirection: ['setDirection2', function(cb){
		overturnDirection(pins, cb);
	}]
}, function(err, result){
	if(err) throw err;
	console.log('-- all done --');
});

// 关闭引脚 [pins]
function closePins(pins, callback){
	async.each(pins, function(pin, cb){
		gpio.close(pin, function(err){
			// if(err) return cb(err);
			cb();
		})
	}, function(err, result){
		if(err) throw err;
		if(err) return callback(err);
		console.log('-- done close all pins %s --',  pins);;
		callback();
	})
}

// 反转电平
function overturnDirection(pins, callback){
	setInterval(function(){
		async.eachSeries(pins, function(pin, cb){
			gpio.read(pin, function(err, value){
				if(err) return cb(err);
				value = value ? 0 : 0.1;
				setDirection([pin], value, cb);
			})
		}, function(err, result){
			if(err) throw err;
			if(err) return callback(err);
			callback();
		})
	}, 2000);
}

// 打开引脚 [pins] 
// optoin: in / input / out / output
function openPins(pins, option, callback){
	async.each(pins, function(pin, cb){
		gpio.open(pin, option, function(err){
			if(err) return cb(err);
			cb();
		});
	}, function(err, result){
		if(err) throw err;
		if(err) return callback(err);
		console.log('-- done open pins %s --', pins);
		callback();
	});
}

// 设置引脚电平 [pins]
// direction: 0, 1
function setDirection(pins, direction, callback){
	async.each(pins, function(pin, cb){
		gpio.write(pin, direction, function(err){
			if(err) return cb(err);
			cb();
		});
	}, function(err, result){
		if(err) throw err;
		if(err) return callback(err);
		console.log('-- done set pins %s to %s', pins, direction);
		callback();
	});
}

// exit process
process.on('SIGINT', function(){
	closePins(pins, function(err, result){
		if(err) console.log(err);
		console.log('process exit, close all pins');
		process.exit(0);
	});
})