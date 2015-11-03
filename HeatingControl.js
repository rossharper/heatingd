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
        var currentLessThanTarget = false;

//        try {
            var targetTemp = targetTemperatureProvider.getTargetTemperature();
            var currentTemp = currentTemperatureProvider.getCurrentTemperature();
            console.log("Current temperature is " + currentTemp + "°C - Target temperature is " + targetTemp + "°C");
            currentLessThanTarget = (currentTemp < targetTemp); // TODO: hysteresis & switching differential
//        }
        // catch(e) {
        //     console.error(e);
        // }
        return currentLessThanTarget;
    }
}

module.exports = {
    HeatingControl : HeatingControl
}
