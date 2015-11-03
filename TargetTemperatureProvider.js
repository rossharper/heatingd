var fs          = require('fs'),
    Schedule    = require('./Schedule').Schedule;

var DEFAULT_SCHEDULE_FILE = "defaultSchedule.json";
var SCHEDULE_FILE = "schedule";
var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function TargetTemperatureProvider(programmeDataPath) {

    var schedule = readSchedule();//new Schedule(readSchedule());

    // TODO: watch for schedule file changes

    this.getTargetTemperature = function() {
        return getTargetTemperatureFromSchedule();
    }

    function getTargetTemperatureFromSchedule() {
        return (inComfortPeriod(new Date())) ? schedule.comfortTemp : schedule.setbackTemp;
    }

    function laterThanStart(date, period) {
        var start = getDateFromTimeStr(date, period.startTime);
        return date.getTime() > start.getTime();
    }

    function earlierThanEnd(date, period) {
        var end = getDateFromTimeStr(date, period.endTime);
        return date.getTime() < end.getTime();
    }

    function getDateFromTimeStr(date, timeStr) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(timeStr.substr(0,2)), parseInt(timeStr.substr(3,2)), 0);
    }

    function getDayOfWeek(date) {
        return DAYS[date.getDay()];
    }

    function inComfortPeriod(date) {
        var periodsForToday = schedule.schedule[getDayOfWeek(date)].comfortPeriods;
        for(var i = 0; i < periodsForToday.length; ++i) {
            if(laterThanStart(date, periodsForToday[i]) && earlierThanEnd(date, periodsForToday[i])) {
                return true;
            }
        }
        return false;
    }

    function getScheduleDataFilePath() {
        return programmeDataPath + "/" + SCHEDULE_FILE;
    }

    function readSchedule() {
        var scheduleFilePath = getScheduleDataFilePath();
        try{
            return readScheduleFile(scheduleFilePath);
        }
        catch(e) {
            if (e.code === 'ENOENT') {
                console.log("Schedule data file missing: " + scheduleFilePath);
                return readScheduleFile(DEFAULT_SCHEDULE_FILE);
            } else {
                throw e;
            }
        }
    }

    function readScheduleFile(scheduleFilePath) {
        var file = fs.readFileSync(scheduleFilePath, "utf8");
        return JSON.parse(file);
    }
}

module.exports = {
    TargetTemperatureProvider : TargetTemperatureProvider
}
