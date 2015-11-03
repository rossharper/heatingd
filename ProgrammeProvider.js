var fs          = require('fs'),
    Programme    = require('./Programme').Programme;

var DEFAULT_PROGRAMME_FILE = "defaultProgramme.json";
var PROGRAMME_FILE = "programme.json";

function ProgrammeProvider(programmeDataPath) {

    var programme = new Programme(readProgramme());
    // todo: watch programme file for changes

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
}

module.exports = {
    ProgrammeProvider : ProgrammeProvider
}
