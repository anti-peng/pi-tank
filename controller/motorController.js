var gpio 	= require('pi-gpio');
var async 	= require('async');

module.exports = {

	// close all pins
	closeAllPins: function(req, res){

	}

}

// 关闭引脚 [pins]
function closePins(pins, callback){
	async.each(pins, function(pin, cb){
		gpio.close(pin, function(err){
			// ignore err
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

// 设置引脚电平