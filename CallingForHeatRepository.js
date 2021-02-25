'use strict'

function callingForHeatRepository (initialCallForHeat, callingForHeatFileWriter, callForHeatOnCommand, callForHeatOffCommand) {
    return {
        _callingForHeat: initialCallForHeat,

        getCallingForHeat: function () {
            return this._callingForHeat
        },

        setCallingForHeat: function (callingForHeat) {
            this._callingForHeat = (callingForHeat === true)
            if (this._callingForHeat) {
                callForHeatOnCommand.execute()
                callingForHeatFileWriter.writeCallingForHeat(1)
            } else {
                callForHeatOffCommand.execute()
                callingForHeatFileWriter.writeCallingForHeat(0)
            }
        }
    }
}

module.exports = {
    CallingForHeatRepository: callingForHeatRepository
}
