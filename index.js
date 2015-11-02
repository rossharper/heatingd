
function RunLoop(intervalMs, callback) {
    this.start = function() {
        this.intervalTimer = setInterval(callback, intervalMs);
    }

    this.resetInterval = function() {
        clearInterval(this.intervalTimer);
        this.start();
    }
}

var i = 0;



var runloop = new RunLoop(5000, onInterval);

function onInterval() {
    console.log("onInterval");
    i++;
    if(i % 5 == 0) {
        console.log("resetting interval");
        runloop.resetInterval();
    }
}

function start() {
    console.log("Starting heatingd...");
    runloop.start();
}
start();
