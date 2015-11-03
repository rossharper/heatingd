var fs          = require('fs'),
    Programme    = require('./Programme').Programme,
    Chokidar = require('chokidar');

var DEFAULT_PROGRAMME_FILE = "defaultProgramme.json";
var PROGRAMME_FILE = "programme.json";

function ProgrammeProvider(programmeDataPath) {

    var programme = new Programme(loadProgrammeFile());
    watchProgrammeFile();

    this.getProgramme = function() {
        return programme;
    }

    function getProgrammeDataFilePath() {
        return programmeDataPath + "/" + PROGRAMME_FILE;
    }

    function readProgrammeFile(programmeFilePath) {
        var file = fs.readFileSync(programmeFilePath, "utf8");
        return JSON.parse(file);
    }

    function loadProgrammeFile() {
        var programmeFilePath = getProgrammeDataFilePath();
        try{
            return readProgrammeFile(programmeFilePath);
        }
        catch(e) {
            if (e.code === 'ENOENT') {
                console.log("Programme data file missing: " + programmeFilePath);
                return readProgrammeFile(DEFAULT_PROGRAMME_FILE);
            } else {
                throw e;
            }
        }
    }

    function onProgrammeFileChange() {
        console.log("Programme file changed. Reloading.");
        programme = new Programme(loadProgrammeFile());
    }

    function watchProgrammeFile() {
        var programmeDataFilePath = getProgrammeDataFilePath();
        var watcher = Chokidar.watch(programmeDataFilePath);

        var log = console.log.bind(console);

        watcher
            .on('error', function(error) { log('Error happened', error); })

        watcher.on('ready', function() {
            log("Watching " + programmeDataFilePath + " for changes...");
            watcher
                .on('add', onProgrammeFileChange)
                .on('change', onProgrammeFileChange);
            });
    }
}

module.exports = {
    ProgrammeProvider : ProgrammeProvider
}
