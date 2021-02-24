'use strict';

const fs = require('fs');
const path = require('path');

const callingForHeatFileName = 'callingForHeat';

function callingForHeatFileWriter(fileLocationPath) {
    this.writeCallingForHeat = function (value) {
        writeValue(value);
    };

    function getFilePath() {
        return path.join(fileLocationPath, '/', callingForHeatFileName);
    }

    function writeValue(value) {
        const filePath = getFilePath();

        try {
            fs.writeFileSync(filePath, `${value}`, 'utf8');
        } catch (e) {
            console.log(`${new Date().toISOString()} Failed to write ${filePath}. Exception: ${e}`);
        }
    }
}

module.exports = {
    CallingForHeatFileWriter: callingForHeatFileWriter
};
