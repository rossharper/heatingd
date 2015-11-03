var DateUtil = require('./DateUtil');

function Programme(programme) {
    this.getCurrentTargetTemperature = function(date) {
        return getOverriddenTemperature() || getProgrammeTemperature(date);
    }

    function getOverriddenTemperature(date) {
        return NaN;
    }

    function getProgrammeTemperature(date) {
        return (inAnyComfortPeriodForDate(date)) ? programme.comfortTemp : programme.setbackTemp;
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
