'use strict';

const SWITCHING_DIFFERENTIAL = 1.00;

function HeatingControl(programme, currentTemperatureProvider, callForHeatOnCommand, callForHeatOffCommand) {

  let callingForHeat = undefined;

  this.onInterval = function () {
    update();
  };

  this.onProgrammeChanged = function (updatedProgramme) {
    callingForHeat = undefined;
    programme = updatedProgramme;
    update();
  };

  function update() {
    if (shouldCallForHeat()) {
      callForHeatOnCommand.execute();
      callingForHeat = true;
    } else {
      callForHeatOffCommand.execute();
      callingForHeat = false;
    }
  }

  function getTargetTemperature() {
    return programme.getCurrentTargetTemperature(new Date());
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
  function shouldCallForHeat() {
    const targetTemp = getTargetTemperature();
    const currentTemp = currentTemperatureProvider.getCurrentTemperature();
    console.log(`Current temperature is ${currentTemp}°C - Setpoint is ${targetTemp}°C`);

    const lowPoint = targetTemp - (0.5 * SWITCHING_DIFFERENTIAL);
    const highPoint = targetTemp + (0.5 * SWITCHING_DIFFERENTIAL);

    if (currentTemp >= highPoint) {
      console.log('Current temp above hysteresis high point');
      return false;
    }
    if (currentTemp < lowPoint) {
      console.log('Current temp below hysteresis low point');
      return true;
    }
    console.log(`Current temperature within switching differential. Continue calling for heat: ${callingForHeat}`);
    return (callingForHeat === undefined) ? true : callingForHeat;
  }
}

module.exports = {
  HeatingControl: HeatingControl
};
