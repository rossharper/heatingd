'use strict'

const chai = require('chai')
const expect = chai.expect
const spies = require('chai-spies')
const CallingForHeatRepository = require('../CallingForHeatRepository').CallingForHeatRepository

chai.use(spies)

describe('Calling for heat repository', () => {
    const onCommandDouble = {
        execute: function () {}
    }
    const offCommandDouble = {
        execute: function () {}
    }
    const writerDouble = {
        writeCallingForHeat: function () {}
    }
    let onCommandSpy
    let offCommandSpy
    let writerSpy

    beforeEach(() => {
        onCommandSpy = chai.spy.on(onCommandDouble, 'execute')
        offCommandSpy = chai.spy.on(offCommandDouble, 'execute')
        writerSpy = chai.spy.on(writerDouble, 'writeCallingForHeat')
    })

    it('should execute ON when setting call for heat TRUE', () => {
        const callingForHeatRepository = new CallingForHeatRepository(false, writerDouble, onCommandDouble, offCommandDouble)

        callingForHeatRepository.setCallingForHeat(true)

        expect(offCommandSpy).to.not.have.been.called()
        expect(onCommandSpy).to.have.been.called.once()
    })

    it('should execute OFF when setting call for heat FALSE', () => {
        const callingForHeatRepository = new CallingForHeatRepository(false, writerDouble, onCommandDouble, offCommandDouble)

        callingForHeatRepository.setCallingForHeat(false)

        expect(offCommandSpy).to.have.been.called.once()
        expect(onCommandSpy).to.not.have.been.called()
    })

    it('should write call for heat flag with 0 value when setting call for heat FALSE', () => {
        const callingForHeatRepository = new CallingForHeatRepository(false, writerDouble, onCommandDouble, offCommandDouble)

        callingForHeatRepository.setCallingForHeat(false)

        expect(writerSpy).to.have.been.called.with(0)
    })

    it('should write call for heat flag with 1 value when setting call for heat TRUE', () => {
        const callingForHeatRepository = new CallingForHeatRepository(false, writerDouble, onCommandDouble, offCommandDouble)

        callingForHeatRepository.setCallingForHeat(true)

        expect(writerSpy).to.have.been.called.with(1)
    })
})
