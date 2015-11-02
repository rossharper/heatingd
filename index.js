
function RunLoop(intervalMs, callback) {
    this.start = function() {
        this.intervalTimer = setInterval(callback, intervalMs);
    }

    this.resetInterval = function() {
        clearInterval(this.intervalTimer);
        this.start();
    }
}

function CurrentTemperatureProvider() {
    this.getCurrentTemperature = function() {
        return 19.99;
    }
}

function TargetTemperatureProvider() {
    this.getTargetTemperature = function() {
        return 20.00;
    }
}

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

function HeatingControl(targetTemperatureProvider, currentTemperatureProvider, callForHeatOnCommand, callForHeatOffCommand) {
    this.onInterval = function() {
        if(shouldCallForHeat()) {
            callForHeatOnCommand.execute();
        }
        else {
            callForHeatOffCommand.execute();
        }
    }

    function shouldCallForHeat() {
        var targetTemp = targetTemperatureProvider.getTargetTemperature();
        var currentTemp = currentTemperatureProvider.getCurrentTemperature();
        return (currentTemp < targetTemp); // TODO: hysteresis
    }
}

function start() {
    console.log("Starting heatingd...");

    var heatingControl = new HeatingControl(
        new TargetTemperatureProvider(),
        new CurrentTemperatureProvider(),
        new CallForHeatOnCommand(),
        new CallForHeatOffCommand()
    );

    var runloop = new RunLoop(5000, function() {
        heatingControl.onInterval();
    });
    runloop.start();
}
start();
