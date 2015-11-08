var ProgrammeProvider   = require('heatingprogramme').ProgrammeProvider;

function TargetTemperatureProvider(programmeDataPath) {

    var programmeProvider = new ProgrammeProvider(programmeDataPath);

    this.getTargetTemperature = function(callback) {
        programmeProvider.getProgramme(function(programme) {
            callback(programme.getCurrentTargetTemperature(new Date()));
        });
    }
}

module.exports = {
    TargetTemperatureProvider : TargetTemperatureProvider
}
