'use strict';

const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
const HeatingControl = require('../HeatingControl').HeatingControl;

chai.use(spies);

describe('Heating Control', () => {

  function programmeDoubleWithTargetTemperature(targetTemp) {
    return {
      getCurrentTargetTemperature: function () {
        return targetTemp;
      }
    };
  }

  function temperatureProviderDoubleWithCurrentTemperature(currentTemp) {
    return {
      currentTemp: currentTemp,
      getCurrentTemperature: function () {
        return this.currentTemp;
      }
    };
  }

  const onCommandDouble = {
    execute: function () {}
  };
  const offCommandDouble = {
    execute: function () {}
  };
  let onCommandSpy;
  let offCommandSpy;

  beforeEach(() => {
    onCommandSpy = chai.spy.on(onCommandDouble, 'execute');
    offCommandSpy = chai.spy.on(offCommandDouble, 'execute');
  });

  it('should execute ON command on initial interval when current temperature below switching differential high point', () => {
    // arrange
    const heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(20.0),
      temperatureProviderDoubleWithCurrentTemperature(20.49),
      onCommandDouble,
      offCommandDouble);

    // act
    heatingControl.onInterval();

    // assert
    expect(onCommandSpy).to.have.been.called();
    expect(offCommandSpy).to.not.have.been.called();
  });

  it('should execute OFF command on initial interval when current temperature above switching differential high point', () => {
    // arrange
    const heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(20.0),
      temperatureProviderDoubleWithCurrentTemperature(20.5),
      onCommandDouble,
      offCommandDouble
    );

    // act
    heatingControl.onInterval();

    // assert
    expect(onCommandSpy).to.not.have.been.called();
    expect(offCommandSpy).to.have.been.called();
  });

  it('should execute ON command on initial interval when current temperature below switching differential low point', () => {
    // arrange
    const heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(20.0),
      temperatureProviderDoubleWithCurrentTemperature(19.49),
      onCommandDouble,
      offCommandDouble);

    // act
    heatingControl.onInterval();

    // assert
    expect(onCommandSpy).to.have.been.called();
    expect(offCommandSpy).to.not.have.been.called();
  });

  it('should execute ON command on subsequent interval when current temperature rising and below switching differential low point', () => {
    // arrange
    const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(19.00);
    const heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(20.0),
      temperatureProviderDouble,
      onCommandDouble,
      offCommandDouble);

    // act
    heatingControl.onInterval();
    temperatureProviderDouble.currentTemp = 19.49;
    heatingControl.onInterval();

    // assert
    expect(onCommandSpy).to.have.been.called.twice;
    expect(offCommandSpy).to.not.have.been.called();
  });

  it('should execute ON command on subsequent interval when current temperature rising and within switching differential', () => {
    // arrange
    const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(19.00);
    const heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(20.0),
      temperatureProviderDouble,
      onCommandDouble,
      offCommandDouble);

    // act
    heatingControl.onInterval();
    temperatureProviderDouble.currentTemp = 20.0;
    heatingControl.onInterval();

    // assert
    expect(onCommandSpy).to.have.been.called.twice;
    expect(offCommandSpy).to.not.have.been.called();
  });

  it('should execute OFF command on subsequent interval when current temperature rising and above switching differential high point', () => {
    // arrange
    const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(20.00);
    const heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(20.0),
      temperatureProviderDouble,
      onCommandDouble,
      offCommandDouble);

    // act
    heatingControl.onInterval();
    temperatureProviderDouble.currentTemp = 20.50;

    expect(onCommandSpy).to.have.been.called();

    heatingControl.onInterval();

    expect(offCommandSpy).to.have.been.called.once();
    expect(onCommandSpy).to.have.been.called.once();
  });

  it('should execute ON command on subsequent interval when current temperature falling and below switching differential low point', () => {
    // arrange
    const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(21.00);
    const heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(20.0),
      temperatureProviderDouble,
      onCommandDouble,
      offCommandDouble);

    // act
    heatingControl.onInterval();
    temperatureProviderDouble.currentTemp = 19.49;

    expect(offCommandSpy).to.have.been.called();

    heatingControl.onInterval();

    expect(offCommandSpy).to.have.been.called.once();
    expect(onCommandSpy).to.have.been.called.once();
  });

  it('should execute OFF command on subsequent interval when current temperature falling into switching differential', () => {
    // arrange
    const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(21.00);
    const heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(20.0),
      temperatureProviderDouble,
      onCommandDouble,
      offCommandDouble);

    // act
    heatingControl.onInterval();
    temperatureProviderDouble.currentTemp = 20.00;

    expect(offCommandSpy).to.have.been.called();

    heatingControl.onInterval();

    expect(offCommandSpy).to.have.been.called.twice();
    expect(onCommandSpy).to.have.not.been.called();
  });

  it('should execute OFF command on subsequent interval when current temperature falling and above switching differential high point', () => {
    // arrange
    const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(22.00);
    const heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(20.0),
      temperatureProviderDouble,
      onCommandDouble,
      offCommandDouble);

    // act
    heatingControl.onInterval();
    temperatureProviderDouble.currentTemp = 21.00;

    expect(offCommandSpy).to.have.been.called();

    heatingControl.onInterval();

    expect(offCommandSpy).to.have.been.called.twice();
    expect(onCommandSpy).to.have.not.been.called();
  });

  it('should execute ON command on progamme changed when current temperature below switching differential low point', () => {
    // arrange
    const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(20.00);
    const heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(19.0),
      temperatureProviderDouble,
      onCommandDouble,
      offCommandDouble);

    // act
    heatingControl.onInterval();

    expect(offCommandSpy).to.have.been.called();

    heatingControl.onProgrammeChanged(programmeDoubleWithTargetTemperature(21.00));

    expect(offCommandSpy).to.have.been.called.once();
    expect(onCommandSpy).to.have.been.called.once();
  });

  it('should execute ON command on progamme changed when current temperature in switching differential', () => {
    // arrange
    const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(20.00);
    const heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(19.0),
      temperatureProviderDouble,
      onCommandDouble,
      offCommandDouble);

    // act
    heatingControl.onInterval();

    expect(offCommandSpy).to.have.been.called();

    heatingControl.onProgrammeChanged(programmeDoubleWithTargetTemperature(20.00));

    expect(offCommandSpy).to.have.been.called.once();
    expect(onCommandSpy).to.have.been.called.once();
  });

  it('should execute OFF command on progamme changed when current temperature above switching differential high point', () => {
    // arrange
    const temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(20.00);
    const heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(21.0),
      temperatureProviderDouble,
      onCommandDouble,
      offCommandDouble);

    // act
    heatingControl.onInterval();

    expect(onCommandSpy).to.have.been.called();

    heatingControl.onProgrammeChanged(programmeDoubleWithTargetTemperature(19.00));

    expect(offCommandSpy).to.have.been.called.once();
    expect(onCommandSpy).to.have.been.called.once();
  });
});
