'use strict';

const fs = require('fs');
const path = require('path');
const chai = require('chai');
const assert = chai.assert;
const CallingForHeatFileWriter = require('../CallingForHeatFileWriter').CallingForHeatFileWriter;

const PATH = '.';
const FILE_NAME = 'callingForHeat';
const FILE_PATH = path.join(PATH, '/', FILE_NAME);

describe('Calling For Heat File Writer', () => {

    beforeEach(() => {
        try {
            deleteFile();
        } catch (e) {
            if (e.code !== 'ENOENT') {
                assert.fail('error cleaning up test file');
            }
        }
    });

    afterEach(() => {
        try {
            deleteFile();
        } catch (e) {
            assert.fail('error cleaning up test file');
        }
    });

    function deleteFile() {
        fs.unlinkSync(FILE_PATH);
    }

    it('should write a file with value 0', () => {
        const writer = new CallingForHeatFileWriter(PATH);

        writer.writeCallingForHeat(0);

        const file = fs.readFileSync(FILE_PATH, 'utf8');
        const value = parseFloat(file);
        assert.isNumber(value);
        assert.strictEqual(value, 0);
    });

    it('should write a file with value 1', () => {
        const writer = new CallingForHeatFileWriter(PATH);

        writer.writeCallingForHeat(1);

        const file = fs.readFileSync(FILE_PATH, 'utf8');
        const value = parseFloat(file);
        assert.isNumber(value);
        assert.strictEqual(value, 1);
    });
});
