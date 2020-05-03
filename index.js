'use strict';

const RunLoop = require('./RunLoop').RunLoop;
const ProgrammeFileLoader = require('heatingprogramme').ProgrammeFileLoader;
const ProgrammeChangeWatcher = require('heatingprogramme').ProgrammeChangeWatcher;
const CurrentTemperatureProvider = require('./CurrentTemperatureProvider').CurrentTemperatureProvider;
const HeatingControl = require('./HeatingControl').HeatingControl;
const CallForHeatCommandFactory = require('./CallForHeatCommandFactory');
const CallingForHeatRepository = require('./CallingForHeatRepository.js').CallingForHeatRepository;
const CallingForHeatFileWriter = require('./CallingForHeatFileWriter').CallingForHeatFileWriter;
const fs = require('fs');

const DEFAULTS = {
  INTERVAL_SECONDS: 30,
  SENSOR_DATA_PATH: '/var/lib/homecontrol/sensordata/temperatureSensors/TA',
  PROGRAMME_DATA_PATH: '/var/lib/homecontrol/programdata'
};

function usage() {
  console.log('Usage: ');
  console.log('  node index.js [-i <INTERVAL_IN_SECONDS>] [-sensorpath <SENSOR_DATA_PATH>]');
  console.log('       [-programme <PROGRAMME_DATA_PATH>]');
  console.log('');
  console.log('         -i    the interval between comparing temperatures and calling for heat');
  console.log('-sensorpath    path at which temperature sensor readings can be read');
  console.log(' -programme    path at which programme/schedule data can be found');
  process.exit();
}

function parseArgs() {
  const args = {
    updateIntervalSeconds: DEFAULTS.INTERVAL_SECONDS,
    sensorDataPath: DEFAULTS.SENSOR_DATA_PATH,
    programmeDataPath: DEFAULTS.PROGRAMME_DATA_PATH
  };

  let argi = 2;

  function hasArg(arg) {
    return process.argv[argi] === arg;
  }

  function readArgValue() {
    return process.argv[++argi] || usage();
  }

  for (; argi < process.argv.length; argi++) {
    if (hasArg('-i')) {
      args.updateIntervalSeconds = parseInt(readArgValue()) || usage();
    } else if (hasArg('-sensorpath')) {
      args.sensorDataPath = readArgValue();
    } else if (hasArg('-programme')) {
      args.programmeDataPath = readArgValue();
    } else {
      usage();
    }
  }

  return args;
}

function start(args) {
  console.log(`${new Date().toISOString()} Starting heatingd...`);

  console.log(`${new Date().toISOString()} Monitoring temperature every ${args.updateIntervalSeconds} seconds.`);
  console.log(`${new Date().toISOString()} Monitoring temperatures from sensor path: ${args.sensorDataPath}`);
  console.log(`${new Date().toISOString()} Monitoring programme/schedule data from path: ${args.programmeDataPath}`);
  console.log(`${new Date().toISOString()} Writing call for heat flag to: ${args.programmeDataPath}`);

  function onProgrammeLoaded(programme) {
    const heatingControl = new HeatingControl(
      programme,
      new CurrentTemperatureProvider(args.sensorDataPath),
      new CallingForHeatRepository(
        false,
        new CallingForHeatFileWriter(args.programmeDataPath),
        new CallForHeatCommandFactory.CallForHeatOnCommand(),
        new CallForHeatCommandFactory.CallForHeatOffCommand())
    );

    ProgrammeChangeWatcher.watchForChanges(args.programmeDataPath, (updatedProgramme) => {
      heatingControl.onProgrammeChanged(updatedProgramme);
    });

    heatingControl.onInterval();
    const runloop = new RunLoop(args.updateIntervalSeconds * 1000, () => {
      heatingControl.onInterval();
    });
    runloop.start();
  }

  ensureProgrammeDataDirectoryExists(args.programmeDataPath, (err) => {
    if (err) {
      process.exit();
    } else {
      ProgrammeFileLoader.loadProgramme(args.programmeDataPath, onProgrammeLoaded);
    }
  });
}

function ensureProgrammeDataDirectoryExists(path, callback) {
  fs.mkdir(path, { recursive: true }, (err) => {
    if (err) {
      if (err.code === 'EEXIST') callback(null); // ignore the error if the folder already exists
      else callback(err); // something else went wrong
    } else callback(null); // successfully created folder
  });
}

start(parseArgs());
