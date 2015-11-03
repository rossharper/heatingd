var SWITCHING_DIFFERENTIAL = 1.00;

function HeatingControl(targetTemperatureProvider, currentTemperatureProvider, callForHeatOnCommand, callForHeatOffCommand) {
    this.onInterval = function() {
        if(shouldCallForHeat()) {
            callForHeatOnCommand.execute();
        }
        else {
            callForHeatOffCommand.execute();
        }
    }

/*
    /|\ L1 - heating signal
     |
  ON |-------|---------|
     |       |         |
     |      /|\       \|/
     |       |    w    |
 OFF |-------|----|----|----> T[°C]
             |         |
             |<--SD--->|

    SD - switching differential (1K)
    W  - room temperature setpoint
    T  - room temperatures
    L1 - Output signal for heating
*/

    function shouldCallForHeat() {
        var currentLessThanTarget = false;

        var targetTemp = targetTemperatureProvider.getTargetTemperature();
        var currentTemp = currentTemperatureProvider.getCurrentTemperature();
        console.log("Current temperature is " + currentTemp + "°C - Target temperature is " + targetTemp + "°C");

        currentLessThanTarget = (currentTemp < targetTemp); // TODO: hysteresis & switching differential

        return currentLessThanTarget;
    }
}

module.exports = {
    HeatingControl : HeatingControl
}
