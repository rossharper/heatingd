var fs = require('fs');

var temperatureSensorDataFile = "value";

function CurrentTemperatureProvider(sensorDataPath) {
    this.getCurrentTemperature = function() {
        return readValue();
    }

    function getSensorDataFilePath() {
        return sensorDataPath + "/" + temperatureSensorDataFile;
    }

    function readValue() {
        var sensorValueFilePath = getSensorDataFilePath();
        try {
            var file = fs.readFileSync(sensorValueFilePath, "utf8");
        }
        catch(e) {
            if (e.code === 'ENOENT') {
                throw "Current temperature value file missing: " + sensorValueFilePath;
            } else {
                throw e;
            }
        }
        var value = parseFloat(file);
        if(!value) {
            throw "Current temperature value file malformed";
        }
        return value;
    }
}

module.exports = {
    CurrentTemperatureProvider : CurrentTemperatureProvider
}
