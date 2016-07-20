var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
var HeatingControl = require('../HeatingControl').HeatingControl;

chai.use(spies);

describe("Heating Control", function() {
  it("should execute call for heat command on update when current target temperature above current temperature", function() {
    // arrange
    var programmeDouble = {
      getCurrentTargetTemperature : function() {
        return 20.0;
      }
    };
    var temperatureProviderDouble = {
      getCurrentTemperature : function() {
        return 18.2;
      }
    }
    var onCommandDouble = {
      execute : function() {}
    }
    var offCommandDouble = {
      execute : function() {}
    }
    var onCommandSpy = chai.spy.on(onCommandDouble, 'execute');
    var offCommandSpy = chai.spy.on(offCommandDouble, 'execute');
    var heatingControl = new HeatingControl(programmeDouble, temperatureProviderDouble, onCommandDouble, offCommandDouble);

    // act
    heatingControl.onInterval();

    // assert
    expect(onCommandSpy).to.have.been.called();
    expect(offCommandSpy).to.not.have.been.called();
  });
});
