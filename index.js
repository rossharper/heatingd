var RunLoop = require('./RunLoop').RunLoop,
    CurrentTemperatureProvider = require('./CurrentTemperatureProvider').CurrentTemperatureProvider,
    TargetTemperatureProvider = require('./TargetTemperatureProvider').TargetTemperatureProvider,
    HeatingControl = require('./HeatingControl').HeatingControl
;

function CallForHeatOnCommand() {
    this.execute = function() {
        console.log("Calling for heat");
    }
}

function CallForHeatOffCommand() {
    this.execute = function() {
        console.log("Calling for heat");
    }
}

function start() {
    console.log("Starting heatingd...");

    var heatingControl = new HeatingControl(
        new TargetTemperatureProvider(),
        new CurrentTemperatureProvider(),
        new CallForHeatOnCommand(),
        new CallForHeatOffCommand()
    );

    heatingControl.onInterval();
    var runloop = new RunLoop(5000, function() {
        heatingControl.onInterval();
    });
    runloop.start();
}
start();
