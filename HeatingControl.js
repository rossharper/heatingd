function HeatingControl(targetTemperatureProvider, currentTemperatureProvider, callForHeatOnCommand, callForHeatOffCommand) {
    this.onInterval = function() {
        if(shouldCallForHeat()) {
            callForHeatOnCommand.execute();
        }
        else {
            callForHeatOffCommand.execute();
        }
    }

    function shouldCallForHeat() {
        var targetTemp = targetTemperatureProvider.getTargetTemperature();
        var currentTemp = currentTemperatureProvider.getCurrentTemperature();
        return (currentTemp < targetTemp); // TODO: hysteresis
    }
}

module.exports = {
    HeatingControl : HeatingControl
}
