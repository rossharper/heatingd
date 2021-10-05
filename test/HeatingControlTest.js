'use strict'

const chai = require('chai')
const assert = chai.assert
const HeatingControl = require('../HeatingControl').HeatingControl

describe('Heating Control', () => {
    function programmeDoubleWithTargetTemperature (targetTemp) {
        return {
            getCurrentTargetTemperature: function () {
                return targetTemp
            }
        }
    }

    function temperatureProviderDoubleWithCurrentTemperature (currentTemp) {
        return {
            currentTemp: currentTemp,
            getCurrentTemperature: function () {
                return this.currentTemp
            }
        }
    }

    function CallingForHeatRepositoryDouble (initialCallForHeat) {
        return {
            _callingForHeat: initialCallForHeat,

            getCallingForHeat: function () {
                return this._callingForHeat
            },

            setCallingForHeat: function (callingForHeat) {
                this._callingForHeat = (callingForHeat === true)
            }
        }
    }

    it('should set call for heat TRUE on initial interval when current temperature below switching differential high point and previously calling for heat', () => {
    // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(true)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(20.0),
            temperatureProviderDoubleWithCurrentTemperature(20.49),
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()

        // assert
        assert.isTrue(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should set call for heat FALSE on initial interval when current temperature below switching differential high point and previously NOT calling for heat', () => {
    // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(false)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(20.0),
            temperatureProviderDoubleWithCurrentTemperature(20.49),
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()

        // assert
        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should set call for heat FALSE on initial interval when current temperature above switching differential high point', () => {
    // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(false)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(20.0),
            temperatureProviderDoubleWithCurrentTemperature(20.5),
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()

        // assert
        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should set call for heat TRUE on initial interval when current temperature below switching differential low point', () => {
    // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(false)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(20.0),
            temperatureProviderDoubleWithCurrentTemperature(19.49),
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()

        // assert
        assert.isTrue(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should set call for heat TRUE on subsequent interval when current temperature rising and below switching differential low point', () => {
    // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(false)
        const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(19.00)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(20.0),
            temperatureProviderDouble,
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()
        temperatureProviderDouble.currentTemp = 19.49
        heatingControl.onInterval()

        // assert
        assert.isTrue(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should set call for heat TRUE on subsequent interval when current temperature rising and within switching differential', () => {
    // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(false)
        const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(19.00)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(20.0),
            temperatureProviderDouble,
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()
        temperatureProviderDouble.currentTemp = 20.0
        heatingControl.onInterval()

        // assert
        assert.isTrue(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should set call for heat FALSE on subsequent interval when current temperature rising and above switching differential high point', () => {
    // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(false)
        const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(20.00)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(20.0),
            temperatureProviderDouble,
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()
        temperatureProviderDouble.currentTemp = 20.50

        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())

        heatingControl.onInterval()

        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should set call for heat TRUE on subsequent interval when current temperature falling and below switching differential low point', () => {
    // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(false)
        const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(21.00)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(20.0),
            temperatureProviderDouble,
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()
        temperatureProviderDouble.currentTemp = 19.49

        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())

        heatingControl.onInterval()

        assert.isTrue(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should set call for heat FALSE on subsequent interval when current temperature falling into switching differential', () => {
    // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(false)
        const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(21.00)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(20.0),
            temperatureProviderDouble,
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()
        temperatureProviderDouble.currentTemp = 20.00

        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())

        heatingControl.onInterval()

        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should set call for heat FALSE on subsequent interval when current temperature falling and above switching differential high point', () => {
    // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(false)
        const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(22.00)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(20.0),
            temperatureProviderDouble,
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()
        temperatureProviderDouble.currentTemp = 21.00

        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())

        heatingControl.onInterval()

        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should set call for heat TRUE on progamme changed when current temperature below switching differential low point', () => {
    // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(false)
        const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(20.00)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(19.0),
            temperatureProviderDouble,
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()

        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())

        heatingControl.onProgrammeChanged(programmeDoubleWithTargetTemperature(21.00))

        assert.isTrue(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should set call for heat FALSE on progamme changed when current temperature matches target temperature', () => {
    // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(false)
        const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(20.00)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(19.0),
            temperatureProviderDouble,
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()

        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())

        heatingControl.onProgrammeChanged(programmeDoubleWithTargetTemperature(20.00))

        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should set call for heat TRUE on progamme changed when current temperature in switching differential and was previously calling for heat', () => {
        // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(true)
        const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(20.59)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(20.50),
            temperatureProviderDouble,
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()

        assert.isTrue(callingForHeatRepositoryDouble.getCallingForHeat())

        heatingControl.onProgrammeChanged(programmeDoubleWithTargetTemperature(21.00))

        assert.isTrue(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should set call for heat FALSE on progamme changed when current temperature above switching differential high point', () => {
    // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(false)
        const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(20.00)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(21.0),
            temperatureProviderDouble,
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()

        assert.isTrue(callingForHeatRepositoryDouble.getCallingForHeat())

        heatingControl.onProgrammeChanged(programmeDoubleWithTargetTemperature(19.00))

        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should continue calling for heat when temp upped twice within differential', () => {
        // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(true)
        const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(20.59)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(20.00),
            temperatureProviderDouble,
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()

        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())

        heatingControl.onProgrammeChanged(programmeDoubleWithTargetTemperature(20.50))
        heatingControl.onProgrammeChanged(programmeDoubleWithTargetTemperature(21.00))

        assert.isTrue(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should stop calling for heat when target temp lowered and current temp above target', () => {
        // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(true)
        const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(19.9)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(20.00),
            temperatureProviderDouble,
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()

        assert.isTrue(callingForHeatRepositoryDouble.getCallingForHeat())

        heatingControl.onProgrammeChanged(programmeDoubleWithTargetTemperature(19.50))

        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())
    })

    it('should start calling for heat when target temp raised and current temp below target', () => {
        // arrange
        const callingForHeatRepositoryDouble = new CallingForHeatRepositoryDouble(false)
        const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(20.10)
        const heatingControl = new HeatingControl(
            programmeDoubleWithTargetTemperature(20.00),
            temperatureProviderDouble,
            callingForHeatRepositoryDouble
        )

        // act
        heatingControl.onInterval()

        assert.isFalse(callingForHeatRepositoryDouble.getCallingForHeat())

        heatingControl.onProgrammeChanged(programmeDoubleWithTargetTemperature(20.50))

        assert.isTrue(callingForHeatRepositoryDouble.getCallingForHeat())
    })
})
