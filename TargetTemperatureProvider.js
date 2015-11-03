var fs = require('fs');

var DEFAULT_SCHEDULE_FILE = "defaultSchedule.json";
var SCHEDULE_FILE = "schedule";
var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function TargetTemperatureProvider(programmeDataPath) {

    var schedule = readSchedule();

    // TODO: watch for schedule file changes

    this.getTargetTemperature = function() {
        return getTargetTemperatureFromSchedule();
    }

    function getTargetTemperatureFromSchedule() {
        return (inComfortPeriod()) ? schedule.comfortTemp : schedule.setbackTemp;
    }

    function laterThanStart(period) {
        var now = new Date();
        var start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(period.startTime.substr(0,2)), parseInt(period.startTime.substr(3,2)), 0);
        return now.getTime() > start.getTime();
    }

    function earlierThanEnd(period) {
        var now = new Date();
        var end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(period.endTime.substr(0,2)), parseInt(period.endTime.substr(3,2)), 0);
        return now.getTime() < end.getTime();
    }

    function getDayOfWeek() {
        var now = new Date();
        return DAYS[now.getDay()];
    }

    function inComfortPeriod() {
        var periodsForToday = schedule.schedule[getDayOfWeek()].comfortPeriods;
        for(var i = 0; i < periodsForToday.length; ++i) {
            if(laterThanStart(periodsForToday[i]) && earlierThanEnd(periodsForToday[i])) {
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
