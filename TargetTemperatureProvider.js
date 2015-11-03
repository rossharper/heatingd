var fs          = require('fs'),
    Programme    = require('./Programme').Programme;

var DEFAULT_PROGRAMME_FILE = "defaultProgramme.json";
var PROGRAMME_FILE = "programme.json";

function TargetTemperatureProvider(programmeDataPath) {

    var programme = new Programme(readProgramme());

    // TODO: watch for schedule file changes

    this.getTargetTemperature = function() {
        return programme.getCurrentTargetTemperature(new Date());
    }

    function getProgrammeDataFilePath() {
        return programmeDataPath + "/" + PROGRAMME_FILE;
    }

    function readProgramme() {
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

    function readProgrammeFile(programmeFilePath) {
        var file = fs.readFileSync(programmeFilePath, "utf8");
        return JSON.parse(file);
    }
}

module.exports = {
    TargetTemperatureProvider : TargetTemperatureProvider
}
