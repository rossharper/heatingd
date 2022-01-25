'use strict'

const exec = require('child_process').execSync

function CallForHeatOnCommand (executeCallForHeatCommand) {
    if (executeCallForHeatCommand) {
        this.execute = function () {
            console.log(`${new Date().toISOString()} Calling for heat ON`)
            exec('callforheat 1')
        }
    } else {
        this.execute = function () {
            console.log(`${new Date().toISOString()} Switch ON (not calling command)`)
        }
    }
}

function CallForHeatOffCommand (executeCallForHeatCommand) {
    if (executeCallForHeatCommand) {
        this.execute = function () {
            console.log(`${new Date().toISOString()} Calling for heat OFF`)
            exec('callforheat 0')
        }
    } else {
        this.execute = function () {
            console.log(`${new Date().toISOString()} Switch OFF (not calling command`)
        }
    }
}

module.exports = {
    CallForHeatOnCommand: CallForHeatOnCommand,
    CallForHeatOffCommand: CallForHeatOffCommand
}
