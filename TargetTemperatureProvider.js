var ProgrammeProvider   = require('heatingprogramme').ProgrammeProvider;

function TargetTemperatureProvider(programmeDataPath) {

    var programmeProvider = new ProgrammeProvider(programmeDataPath);

    this.getTargetTemperature = function() {
        return programmeProvider.getProgramme().getCurrentTargetTemperature(new Date());
    }
}

module.exports = {
    TargetTemperatureProvider : TargetTemperatureProvider
}
