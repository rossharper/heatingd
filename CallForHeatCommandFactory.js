
var callForHeatShellCommand = "";

function CallForHeatOnCommand() {
    this.execute = function() {
        console.log("Calling for heat ON");
    }
}

function CallForHeatOffCommand() {
    this.execute = function() {
        console.log("Calling for heat OFF");
    }
}

module.exports = {
    CallForHeatOnCommand : CallForHeatOnCommand,
    CallForHeatOffCommand : CallForHeatOffCommand
}
