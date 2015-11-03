var DateUtil = require('./DateUtil');

function Programme(programme) {
    this.getComfortTemperature = function() {
        return programme.comfortTemp;
    }
    this.getSetbackTemperature = function() {
        return programme.setbackTemp;
    }
    this.getCurrentTargetTemperature = function(date) {
        return (inAnyComfortPeriodForDate(date)) ? this.getComfortTemperature() : this.getSetbackTemperature();
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
