'use strict'

const ProgrammeProvider = require('heatingprogramme').ProgrammeProvider

function TargetTemperatureProvider (programmeDataPath) {
    const programmeProvider = new ProgrammeProvider(programmeDataPath)

    this.getTargetTemperature = function (callback) {
        programmeProvider.getProgramme((programme) => {
            callback(programme.getCurrentTargetTemperature(new Date()))
        })
    }
}

module.exports = {
    TargetTemperatureProvider: TargetTemperatureProvider
}
