var RunLoop = require('./RunLoop').RunLoop,
    CurrentTemperatureProvider = require('./CurrentTemperatureProvider').CurrentTemperatureProvider,
    TargetTemperatureProvider = require('./TargetTemperatureProvider').TargetTemperatureProvider,
    HeatingControl = require('./HeatingControl').HeatingControl
    CallForHeatCommandFactory = require('./CallForHeatCommandFactory')
;

function start() {
    console.log("Starting heatingd...");

    var heatingControl = new HeatingControl(
        new TargetTemperatureProvider(),
        new CurrentTemperatureProvider(),
        new CallForHeatCommandFactory.CallForHeatOnCommand(),
        new CallForHeatCommandFactory.CallForHeatOffCommand()
    );

    heatingControl.onInterval();
    var runloop = new RunLoop(5000, function() {
        heatingControl.onInterval();
    });
    runloop.start();
}
start();
