var DateUtil = require('./DateUtil');

function Programme(programme) {
    this.getCurrentTargetTemperature = function(date) {
        if(!programme.heatingOn) {
            return programme.frostProtectTemp;
        }
        return getOverriddenTemperature(date) || getProgrammeTemperature(date);
    }

    function getOverriddenTemperature(date) {
        if(inOverridePeriod(date)) {
            return getTemperatureForComfortState(programme.override.comfortState);
        }
        return NaN;
    }

    function inOverridePeriod(date) {
        return programme.override && programme.override.until && beforeOverrideEnd(date, programme.override.until);
    }

    function beforeOverrideEnd(date, overrideEndTimeMs) {
        return date.getTime() < overrideEndTimeMs;
    }

    function getProgrammeTemperature(date) {
        return getTemperatureForComfortState(inAnyComfortPeriodForDate(date));
    }

    function getTemperatureForComfortState(comfortState) {
        return comfortState ? programme.comfortTemp : programme.setbackTemp;
    }

    function laterThanComfortPeriodStart(date, period) {
        var start = DateUtil.getDateFromTimeStr(date, period.startTime);
        return DateUtil.isFirstDateBeforeSecondDate(start, date);
    }

    function earlierThanComfortPeriodEnd(date, period) {
        var end = DateUtil.getDateFromTimeStr(date, period.endTime);
        return DateUtil.isFirstDateBeforeSecondDate(date, end);
    }

    function inComfortPeriod(date, comfortPeriod) {
        return laterThanComfortPeriodStart(date, comfortPeriod) && earlierThanComfortPeriodEnd(date, comfortPeriod);
    }

    function inAnyComfortPeriodForDate(date) {
        var periodsForToday = programme.schedule[DateUtil.getDayOfWeek(date)].comfortPeriods;
        for(var i = 0; i < periodsForToday.length; ++i) {
            if(inComfortPeriod(date, periodsForToday[i])) {
                return true;
            }
        }
        return false;
    }
}

module.exports = {
    Programme : Programme
}
