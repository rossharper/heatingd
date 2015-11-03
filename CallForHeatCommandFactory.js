
var callForHeatShellCommand = "";

function CallForHeatOnCommand() {
    this.execute = function() {
        console.log("Calling for heat ON");
        // TODO: call for heat!
    }
}

function CallForHeatOffCommand() {
    this.execute = function() {
        console.log("Calling for heat OFF");
        // TODO: call for heat off!
    }
}

module.exports = {
    CallForHeatOnCommand : CallForHeatOnCommand,
    CallForHeatOffCommand : CallForHeatOffCommand
}
