'use strict';

function callingForHeatRepository(initialCallForHeat, callForHeatOnCommand, callForHeatOffCommand) {
    return {
        _callingForHeat: initialCallForHeat,

        getCallingForHeat: function () {
            return this._callingForHeat;
        },

        setCallingForHeat: function (callingForHeat) {
            this._callingForHeat = (callingForHeat === true);
            if (this._callingForHeat) {
                callForHeatOnCommand.execute();
            } else {
                callForHeatOffCommand.execute();
            }
        }
    };
}

module.exports = {
    CallingForHeatRepository: callingForHeatRepository
};
