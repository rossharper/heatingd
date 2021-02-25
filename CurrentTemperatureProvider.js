'use strict'

const fs = require('fs')
const path = require('path')
const temperatureSensorDataFile = 'value'

function CurrentTemperatureProvider (sensorDataPath) {
    this.getCurrentTemperature = function () {
        return readValue()
    }

    function getSensorDataFilePath () {
        return path.join(sensorDataPath, '/', temperatureSensorDataFile)
    }

    function readValue () {
        const sensorValueFilePath = getSensorDataFilePath()
        try {
            const file = fs.readFileSync(sensorValueFilePath, 'utf8')
            const value = parseFloat(file)
            if (!value) {
                throw new Error('Current temperature value file malformed')
            }
            return value
        } catch (e) {
            if (e.code === 'ENOENT') {
                throw new Error(`Current temperature value file missing: ${sensorValueFilePath}`)
            } else {
                throw e
            }
        }
    }
}

module.exports = {
    CurrentTemperatureProvider: CurrentTemperatureProvider
}
