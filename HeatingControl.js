'use strict'

const SWITCHING_DIFFERENTIAL = 1.00

function HeatingControl (programme, currentTemperatureProvider, callingForHeatRepository) {
    this.onInterval = function () {
        update()
    }

    this.onProgrammeChanged = function (updatedProgramme) {
        const oldTargetTemp = getTargetTemperature()
        const newTargetTemp = updatedProgramme.getCurrentTargetTemperature(new Date())
        const currentTemp = currentTemperatureProvider.getCurrentTemperature()

        const tempTurnedDown = newTargetTemp < oldTargetTemp
        const tempTurnedUp = newTargetTemp > oldTargetTemp

        if (tempTurnedDown && currentTemp > newTargetTemp) {
            callingForHeatRepository.setCallingForHeat(false)
        } else if (tempTurnedUp && currentTemp < newTargetTemp) {
            callingForHeatRepository.setCallingForHeat(true)
        }

        programme = updatedProgramme
        update()
    }

    function update () {
        if (shouldCallForHeat()) {
            callingForHeatRepository.setCallingForHeat(true)
        } else {
            callingForHeatRepository.setCallingForHeat(false)
        }
    }

    function getTargetTemperature () {
        return programme.getCurrentTargetTemperature(new Date())
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
    function shouldCallForHeat () {
        const targetTemp = getTargetTemperature()
        const currentTemp = currentTemperatureProvider.getCurrentTemperature()
        console.log(`${new Date().toISOString()} Current temperature is ${currentTemp}°C - Setpoint is ${targetTemp}°C`)

        const lowPoint = targetTemp - (0.5 * SWITCHING_DIFFERENTIAL)
        const highPoint = targetTemp + (0.5 * SWITCHING_DIFFERENTIAL)

        if (currentTemp >= highPoint) {
            console.log(`${new Date().toISOString()} Current temp above hysteresis high point`)
            return false
        }
        if (currentTemp < lowPoint) {
            console.log(`${new Date().toISOString()} Current temp below hysteresis low point`)
            return true
        }
        console.log(`${new Date().toISOString()} Current temperature within switching differential. Continue calling for heat: ${callingForHeatRepository.getCallingForHeat()}`)
        return callingForHeatRepository.getCallingForHeat()
    }
}

module.exports = {
    HeatingControl: HeatingControl
}
