var RunLoop = require('./RunLoop').RunLoop,
    CurrentTemperatureProvider = require('./CurrentTemperatureProvider').CurrentTemperatureProvider,
    TargetTemperatureProvider = require('./TargetTemperatureProvider').TargetTemperatureProvider,
    HeatingControl = require('./HeatingControl').HeatingControl
    CallForHeatCommandFactory = require('./CallForHeatCommandFactory')
;

var DEFAULT_INTERVAL_SECONDS = 30;

function usage() {
    console.log("Usage: node index.js [-i <INTERVAL_IN_SECONDS>]");
    process.exit();
}

function parseArgs() {
    var args = {
        updateIntervalSeconds : DEFAULT_INTERVAL_SECONDS
    };

    for(var argi = 2; argi < process.argv.length - 1; argi+=2) {
        if(process.argv[argi] === '-i') {
            args.updateIntervalSeconds = parseInt(process.argv[argi + 1]) || usage();
        }
    }

    return args;
}

function start(args) {
    console.log("Starting heatingd...");

    var heatingControl = new HeatingControl(
        new TargetTemperatureProvider(),
        new CurrentTemperatureProvider(),
        new CallForHeatCommandFactory.CallForHeatOnCommand(),
        new CallForHeatCommandFactory.CallForHeatOffCommand()
    );

    heatingControl.onInterval();
    var runloop = new RunLoop(args.updateIntervalSeconds * 1000, function() {
        heatingControl.onInterval();
    });
    runloop.start();
}

parseArgs();
start(parseArgs());
