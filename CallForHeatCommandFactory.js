
var callForHeatShellCommand = "";

function CallForHeatOnCommand() {
    this.execute = function() {
        console.log("Calling for heat");
    }
}

function CallForHeatOffCommand() {
    this.execute = function() {
        console.log("Calling for heat");
    }
}

module.exports = {
    CallForHeatOnCommand : CallForHeatOnCommand,
    CallForHeatOffCommand : CallForHeatOffCommand
}
