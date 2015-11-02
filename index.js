var RunLoop = require('./RunLoop').RunLoop,
    CurrentTemperatureProvider = require('./CurrentTemperatureProvider').CurrentTemperatureProvider,
    TargetTemperatureProvider = require('./TargetTemperatureProvider').TargetTemperatureProvider,
    HeatingControl = require('./HeatingControl').HeatingControl
    CallForHeatCommandFactory = require('./CallForHeatCommandFactory')
;

var DEFAULTS = {
    INTERVAL_SECONDS : 30,
    SENSOR_DATA_PATH : "/var/lib/homecontrol/sensordata/temperatureSensors/TA"
};

function usage() {
    console.log("Usage: node index.js [-i <INTERVAL_IN_SECONDS>] [-sensorpath <SENSOR_DATA_PATH>]");
    console.log("         -i    the interval between comparing temperatures and calling for heat");
    console.log("-sensorpath    path at which temperature sensor readings can be read");
    process.exit();
}

function parseArgs() {
    var args = {
        updateIntervalSeconds : DEFAULTS.INTERVAL_SECONDS,
        sensorDataPath : DEFAULTS.SENSOR_DATA_PATH
    };

    for(var argi = 2; argi < process.argv.length; argi++) {
        if(process.argv[argi] === '-i') {
            args.updateIntervalSeconds = parseInt(process.argv[++argi]) || usage();
        }
        else if(process.argv[argi] === '-sensorpath') {
            args.sensorDataPath = process.argv[++argi] || usage();
        }
        else {
            usage();
        }
    }

    return args;
}

function start(args) {
    console.log("Starting heatingd...");

    console.log("Monitoring temperature every " + args.updateIntervalSeconds + " seconds.");
    console.log("Monitoring temperatures from sensor path: " + args.sensorDataPath);

    var heatingControl = new HeatingControl(
        new TargetTemperatureProvider(),
        new CurrentTemperatureProvider(args.sensorDataPath),
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
