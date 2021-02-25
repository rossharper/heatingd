'use strict'

const exec = require('child_process').execSync

function CallForHeatOnCommand () {
    this.execute = function () {
        console.log(`${new Date().toISOString()} Calling for heat ON`)
        exec('callforheat 1')
    }
}

function CallForHeatOffCommand () {
    this.execute = function () {
        console.log(`${new Date().toISOString()} Calling for heat OFF`)
        exec('callforheat 0')
    }
}

module.exports = {
    CallForHeatOnCommand: CallForHeatOnCommand,
    CallForHeatOffCommand: CallForHeatOffCommand
}
