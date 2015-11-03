var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

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
        var start = getDateFromTimeStr(date, period.startTime);
        return isFirstDateBeforeSecondDate(start, date);
    }

    function earlierThanComfortPeriodEnd(date, period) {
        var end = getDateFromTimeStr(date, period.endTime);
        return isFirstDateBeforeSecondDate(date, end);
    }

    function isFirstDateBeforeSecondDate(firstDate, secondDate) {
        return firstDate.getTime() < secondDate.getTime();
    }

    function getDateFromTimeStr(date, timeStr) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(timeStr.substr(0,2)), parseInt(timeStr.substr(3,2)), 0);
    }

    function getDayOfWeek(date) {
        return DAYS[date.getDay()];
    }

    function inComfortPeriod(date, comfortPeriod) {
        return laterThanComfortPeriodStart(date, comfortPeriod) && earlierThanComfortPeriodEnd(date, comfortPeriod);
    }

    function inAnyComfortPeriodForDate(date) {
        var periodsForToday = programme.schedule[getDayOfWeek(date)].comfortPeriods;
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
