'use strict';

const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
const CallingForHeatRepository = require('../CallingForHeatRepository').CallingForHeatRepository;

chai.use(spies);

describe('Calling for heat repository', () => {

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

      it('should execute ON when setting call for heat TRUE', () => {
        const callingForHeatRepository = new CallingForHeatRepository(false, onCommandDouble, offCommandDouble);

        callingForHeatRepository.setCallingForHeat(true);

        expect(offCommandSpy).to.not.have.been.called();
        expect(onCommandSpy).to.have.been.called.once();
      });

      it('should execute OFF when setting call for heat FALSE', () => {
        const callingForHeatRepository = new CallingForHeatRepository(false, onCommandDouble, offCommandDouble);

        callingForHeatRepository.setCallingForHeat(false);

        expect(offCommandSpy).to.have.been.called.once();
        expect(onCommandSpy).to.not.have.been.called();
      });
});
