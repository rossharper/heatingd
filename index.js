var RunLoop = require('./RunLoop').RunLoop,
    ProgrammeFileLoader = require('heatingprogramme').ProgrammeFileLoader,
    ProgrammeChangeWatcher = require('heatingprogramme').ProgrammeChangeWatcher,
    CurrentTemperatureProvider = require('./CurrentTemperatureProvider').CurrentTemperatureProvider,
    HeatingControl = require('./HeatingControl').HeatingControl
    CallForHeatCommandFactory = require('./CallForHeatCommandFactory')
;

var DEFAULTS = {
    INTERVAL_SECONDS    : 30,
    SENSOR_DATA_PATH    : "/var/lib/homecontrol/sensordata/temperatureSensors/TA",
    PROGRAMME_DATA_PATH : "/var/lib/homecontrol/programdata"
};

function usage() {
    console.log("Usage: ");
    console.log("  node index.js [-i <INTERVAL_IN_SECONDS>] [-sensorpath <SENSOR_DATA_PATH>]");
    console.log("       [-programme <PROGRAMME_DATA_PATH>]");
    console.log("");
    console.log("         -i    the interval between comparing temperatures and calling for heat");
    console.log("-sensorpath    path at which temperature sensor readings can be read");
    console.log(" -programme    path at which programme/schedule data can be found");
    process.exit();
}

function parseArgs() {
    var args = {
        updateIntervalSeconds : DEFAULTS.INTERVAL_SECONDS,
        sensorDataPath : DEFAULTS.SENSOR_DATA_PATH,
        programmeDataPath : DEFAULTS.PROGRAMME_DATA_PATH
    };

    function hasArg(arg) {
        return process.argv[argi] === arg;
    }

    function readArgValue() {
        return process.argv[++argi] || usage();
    }

    for(var argi = 2; argi < process.argv.length; argi++) {
        if(hasArg('-i')) {
            args.updateIntervalSeconds = parseInt(readArgValue()) || usage();
        }
        else if(hasArg('-sensorpath')) {
            args.sensorDataPath = readArgValue();
        }
        else if(hasArg('-programme')) {
            args.programmeDataPath = readArgValue();
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
    console.log("Monitoring programme/schedule data from path: " + args.programmeDataPath);

    function onProgrammeLoaded(programme) {
        var heatingControl = new HeatingControl(
            programme,
            new CurrentTemperatureProvider(args.sensorDataPath),
            new CallForHeatCommandFactory.CallForHeatOnCommand(),
            new CallForHeatCommandFactory.CallForHeatOffCommand()
        );

        ProgrammeChangeWatcher.watchForChanges(args.programmeDataPath, function(updatedProgramme) {
            heatingControl.onProgrammeChanged(updatedProgramme);
        });

        heatingControl.onInterval();
        var runloop = new RunLoop(args.updateIntervalSeconds * 1000, function() {
            heatingControl.onInterval();
        });
        runloop.start();
    }

    ProgrammeFileLoader.loadProgramme(args.programmeDataPath, onProgrammeLoaded);
}

parseArgs();
start(parseArgs());
