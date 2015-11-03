var fs = require('fs');

var scheduleFile = "schedule";
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

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

    function inComfortPeriod() {
        var now = new Date();
        var dayOfWeekNum = now.getDay();
        console.log("day: " + dayOfWeekNum);
        var day = days[dayOfWeekNum];
        console.log("day: " + day);
        var periodsForToday = schedule.schedule[day].comfortPeriods;
        for(var i = 0; i < periodsForToday.length; ++i) {
            console.log(periodsForToday[i]);
            if(laterThanStart(periodsForToday[i]) && earlierThanEnd(periodsForToday[i])) {
                return true;
            }
        }
        return false;
    }

    function getScheduleDataFilePath() {
        return programmeDataPath + "/" + scheduleFile;
    }

    function readSchedule() {
        var scheduleFilePath = getScheduleDataFilePath();
        try{
            return readScheduleFile(scheduleFilePath);
        }
        catch(e) {
            if (e.code === 'ENOENT') {
                console.log("Schedule data file missing: " + scheduleFilePath);
                return readScheduleFile('defaultSchedule.json');
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
