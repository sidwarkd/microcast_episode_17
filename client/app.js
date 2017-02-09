var config = require("./config.js");
var socket = require("socket.io-client")(config.server_url);
var gpio = require("rpi-gpio");
var sensorLib = require('node-dht-sensor');

var data=0;

process.on("SIGINT", function(){
  gpio.write(config.led, 1, function(){
    gpio.destroy(function(){
      process.exit();
    });
  });
});

gpio.setup(config.led, gpio.DIR_OUT, function(){
  gpio.write(config.led, 1); // turns led off
});

var dht_sensor = {
    initialize: function () {
        return sensorLib.initialize(11, 4);
    },
    read: function () {
      var readout = sensorLib.read();
      console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
            'humidity: ' + readout.humidity.toFixed(2) + '%');
      return readout;
    }
};
 
if (dht_sensor.initialize()) {
    console.log("DHT Sensor initialized!");
} else {
    console.warn('Failed to initialize sensor');
}

socket.on("connect", function(){
  console.log("Connected to server");
  socket.on("updateState", function(state){
    console.log("The new state is: " + state);
    //gpio.write(config.led, !state);
  });
  // send Temperature data every 5 seconds
  setInterval(function(){
    socket.emit("dh11Reading", dht_sensor.read());
  }, 5000);
})
