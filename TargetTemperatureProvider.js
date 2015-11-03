var fs          = require('fs'),
    Schedule    = require('./Schedule').Schedule;

var DEFAULT_SCHEDULE_FILE = "defaultSchedule.json";
var SCHEDULE_FILE = "schedule";
var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function TargetTemperatureProvider(programmeDataPath) {

    var schedule = new Schedule(readSchedule());

    // TODO: watch for schedule file changes

    this.getTargetTemperature = function() {
        return schedule.getCurrentTargetTemperature(new Date());
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
