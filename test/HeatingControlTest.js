var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
var HeatingControl = require('../HeatingControl').HeatingControl;

chai.use(spies);

describe("Heating Control", function() {

  function programmeDoubleWithTargetTemperature(targetTemp) {
    return {
      getCurrentTargetTemperature : function() {
        return targetTemp;
      }
    };
  }

  function temperatureProviderDoubleWithCurrentTemperature(currentTemp) {
    return {
      getCurrentTemperature : function() {
        return currentTemp;
      }
    };
  }

  var onCommandDouble = {
    execute : function() {}
  }
  var offCommandDouble = {
    execute : function() {}
  }
  var onCommandSpy;
  var offCommandSpy;

  beforeEach(function() {
    onCommandSpy = chai.spy.on(onCommandDouble, 'execute');
    offCommandSpy = chai.spy.on(offCommandDouble, 'execute');
  });

  it("should execute call for heat ON command on interval when target temperature above current temperature", function() {
    // arrange
    var heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(20.0),
      temperatureProviderDoubleWithCurrentTemperature(19.4),
      onCommandDouble,
      offCommandDouble);

    // act
    heatingControl.onInterval();

    // assert
    expect(onCommandSpy).to.have.been.called();
    expect(offCommandSpy).to.not.have.been.called();
  });

  it("should execute call for heat OFF command on interval when target temperature below current temperature", function() {
    // arrange
    var heatingControl = new HeatingControl(
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

  it("should execute call for heat ON command on first interval when target temperature in switching differential above target", function() {
    // arrange
    var heatingControl = new HeatingControl(
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

  it("should execute call for heat ON command on first interval when target temperature in switching differential above target", function() {
    // arrange
    var heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(20.0),
      temperatureProviderDoubleWithCurrentTemperature(19.50),
      onCommandDouble,
      offCommandDouble);

    // act
    heatingControl.onInterval();

    // assert
    expect(onCommandSpy).to.have.been.called();
    expect(offCommandSpy).to.not.have.been.called();
  });

  it("should execute call for heat ON command on subsequent interval when target temperature in switching differential above target", function() {
    // arrange
    var heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(20.0),
      temperatureProviderDoubleWithCurrentTemperature(19.50),
      onCommandDouble,
      offCommandDouble);

    // act
    heatingControl.onInterval();
    heatingControl.onInterval();

    // assert
    expect(onCommandSpy).to.have.been.called.twice;
    expect(offCommandSpy).to.not.have.been.called();
  });

  // current temp in switching diff (rising)

  // current temp in switching diff (falling)

  // on programme changed
});
