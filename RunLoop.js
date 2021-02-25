'use strict'

function RunLoop (intervalMs, callback) {
    this.start = function () {
        this.intervalTimer = setInterval(callback, intervalMs)
    }

    this.resetInterval = function () {
        clearInterval(this.intervalTimer)
        this.start()
    }
}

module.exports = {
    RunLoop: RunLoop
}
