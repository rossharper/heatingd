var SWITCHING_DIFFERENTIAL = 1.00;

function HeatingControl(targetTemperatureProvider, currentTemperatureProvider, callForHeatOnCommand, callForHeatOffCommand) {
    this.onInterval = function() {
        if(shouldCallForHeat()) {
            callForHeatOnCommand.execute();
            callingForHeat = true;
        }
        else {
            callForHeatOffCommand.execute();
            callingForHeat = false;
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

    var callingForHeat = false;
    function shouldCallForHeat() {
        var targetTemp = targetTemperatureProvider.getTargetTemperature();
        var currentTemp = currentTemperatureProvider.getCurrentTemperature();
        console.log("Current temperature is " + currentTemp + "°C - Setpoint is " + targetTemp + "°C");

        var lowPoint = targetTemp - (0.5 * SWITCHING_DIFFERENTIAL);
        var highPoint = targetTemp + (0.5 * SWITCHING_DIFFERENTIAL);

        if(currentTemp >= highPoint) {
            console.log("Current temp above hysteresis high point");
            return false;
        }
        if(currentTemp < lowPoint) {
            console.log("Current temp below hysteresis low point");
            return true;
        }
        console.log("Current temperature within switching differential. Continue calling for heat: " + callingForHeat);
        return callingForHeat;
    }
}

module.exports = {
    HeatingControl : HeatingControl
}
