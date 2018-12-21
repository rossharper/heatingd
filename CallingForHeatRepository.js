'use strict';

function callingForHeatRepository(initialCallForHeat) {
    return {
        _callingForHeat: initialCallForHeat,

        getCallingForHeat: function () {
            return this._callingForHeat;
        },

        setCallingForHeat: function (callingForHeat) {
            this._callingForHeat = (callingForHeat === true);
        }
    };
}

module.exports = {
    CallingForHeatRepository: callingForHeatRepository
};
