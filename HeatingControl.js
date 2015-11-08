var SWITCHING_DIFFERENTIAL = 1.00;

function HeatingControl(targetTemperatureProvider, currentTemperatureProvider, callForHeatOnCommand, callForHeatOffCommand) {
    this.onInterval = function() {
        shouldCallForHeat(function(callForHeat) {
            if(callForHeat) {
                callForHeatOnCommand.execute();
                callingForHeat = true;
            }
            else {
                callForHeatOffCommand.execute();
                callingForHeat = false;
            }
        });
    }

/*
    Hysteresis
    ==========

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
    function shouldCallForHeat(callback) {
        targetTemperatureProvider.getTargetTemperature(function(targetTemp) {
            var currentTemp = currentTemperatureProvider.getCurrentTemperature();
            console.log("Current temperature is " + currentTemp + "°C - Setpoint is " + targetTemp + "°C");

            var lowPoint = targetTemp - (0.5 * SWITCHING_DIFFERENTIAL);
            var highPoint = targetTemp + (0.5 * SWITCHING_DIFFERENTIAL);

            if(currentTemp >= highPoint) {
                console.log("Current temp above hysteresis high point");
                callback(false);
                return;
            }
            if(currentTemp < lowPoint) {
                console.log("Current temp below hysteresis low point");
                callback(true);
                return;
            }
            console.log("Current temperature within switching differential. Continue calling for heat: " + callingForHeat);
            callback(callingForHeat);
        });
    }
}

module.exports = {
    HeatingControl : HeatingControl
}
