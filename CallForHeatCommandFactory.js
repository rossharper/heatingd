var sys = require('sys')
var exec = require('child_process').execSync;

var callForHeatShellCommand = "";

function CallForHeatOnCommand() {
    this.execute = function() {
        console.log("Calling for heat ON");
        exec("callforheat 1");
    }
}

function CallForHeatOffCommand() {
    this.execute = function() {
        console.log("Calling for heat OFF");
        exec("callforheat 0");
    }
}

module.exports = {
    CallForHeatOnCommand : CallForHeatOnCommand,
    CallForHeatOffCommand : CallForHeatOffCommand
}
