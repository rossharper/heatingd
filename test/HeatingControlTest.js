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
      currentTemp : currentTemp,
      getCurrentTemperature : function() {
        return this.currentTemp;
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

  it("should execute ON command on initial interval when current temperature below switching differential high point", function() {
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

  it("should execute OFF command on initial interval when current temperature above switching differential high point", function() {
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

  it("should execute ON command on initial interval when current temperature below switching differential low point", function() {
    // arrange
    var heatingControl = new HeatingControl(
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

  it("should execute ON command on subsequent interval when current temperature rising and below switching differential low point", function() {
    // arrange
    var temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(19.00)
    var heatingControl = new HeatingControl(
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

  it("should execute ON command on subsequent interval when current temperature rising and within switching differential", function() {
    // arrange
    var temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(19.00)
    var heatingControl = new HeatingControl(
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

  it("should execute OFF command on subsequent interval when current temperature rising and above switching differential high point", function() {
    // arrange
    var temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(20.00)
    var heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(20.0),
      temperatureProviderDouble,
      onCommandDouble,
      offCommandDouble);

      // act
      heatingControl.onInterval();
      temperatureProviderDouble.currentTemp = 20.50;

      expect(onCommandSpy).to.have.been.called();

      heatingControl.onInterval();

      expect(offCommandSpy).to.have.been.called();
  });

  it("should execute ON command on subsequent interval when current temperature falling and below switching differential low point", function() {
    // arrange
    var temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(21.00)
    var heatingControl = new HeatingControl(
      programmeDoubleWithTargetTemperature(20.0),
      temperatureProviderDouble,
      onCommandDouble,
      offCommandDouble);

      // act
      heatingControl.onInterval();
      temperatureProviderDouble.currentTemp = 19.49;

      expect(offCommandSpy).to.have.been.called();

      heatingControl.onInterval();

      expect(onCommandSpy).to.have.been.called();
  });

  it("should execute OFF command on subsequent interval when current temperature falling into switching differential", function() {
    // arrange
    var temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(21.00)
    var heatingControl = new HeatingControl(
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
  });

  it("should execute OFF command on subsequent interval when current temperature falling and above switching differential high point", function() {
    // arrange
    var temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(22.00)
    var heatingControl = new HeatingControl(
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
  });

  it("should execute ON command on progamme changed when current temperature below switching differential low point", function() {
    // arrange
    var temperatureProviderDouble = temperatureProviderDoubleWithCurrentTemperature(20.00)
    var heatingControl = new HeatingControl(
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

  /*
                 | below h low | in h | above h high |
    init         |       X     |   X  |      X       |
    subs rising  |       X     |   X  |      X       |
    subs falling |       X     |   X  |      X       |
    prog changed |       X     |      |              |
  */

  // current temp in switching diff (rising)

  // current temp in switching diff (falling)

  // on programme changed
});
