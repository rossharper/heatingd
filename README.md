# heatingd

The heating daemon component of my Raspberry Pi based IoT heating system.

The heating daemon will load (and listen for changes to) the heating programme defined at the programme path (defaults to `/var/lib/homecontrol/programdata`). The heating programme provides the current target temperature, based on the current day/time. See https://github.com/rossharper/heatingprogramme for programme data file format.

The daemon will then read temperature data periodically, as defined by the interval (defaults to 30 seconds). Temperature data is read from the sensor path (defaults to `/var/lib/homecontrol/sensordata/temperatureSensors/TA`). Currently only a single sensor is supported. The sensorpath should have a file named `value` which contains the current temperature.

The heating daemon calls for heat (or cancels a call for heat) via the `callforheat` command provided by [boilercontrol](http://github.com/rossharper/boilercontrol).

The heating daemon implements a hysteresis algorithm to prevent thrashing about the setpoint. The switching differential is 1°C.
 
    Hysteresis
    ==========

       /|\ L1 - heating signal
        |
    ON  |-------|---------|
        |       |         |
        |      /|\       \|/
        |       |    w    |
    OFF |-------|----|----|----> T[°C]
                |         |
                |<--SD--->|

    SD - switching differential (1K)
    W  - room temperature setpoint
    T  - room temperatures
    L1 - Output signal for heating

# Usage

    node index.js [-i <INTERVAL_IN_SECONDS>] [-sensorpath <SENSOR_DATA_PATH>] [-programme <PROGRAMME_DATA_PATH>]

             -i    the interval between comparing temperatures
                   and calling for heat
                   (default: 30 seconds)

    -sensorpath    path at which temperature sensor
                   readings can be read
                   (deafult: /var/lib/homecontrol/sensordata/temperatureSensors/TA )

     -programme    path at which programme/schedule data can be found
                   (default: /var/lib/homecontrol/programdata)

# Run in background

To run with defaults in forever

    ./start.sh

# Install as startup daemon

    sudo ./installDaemon.sh

This script will set up the app to run at startup using forever-service. The service will run as the user 'pi'.

Note: the daemon defaults are used in this case.

# Dependencies

[boilercontrol](http://github.com/rossharper/boilercontrol)

[forever](https://github.com/foreverjs/forever)

[forever-service](https://github.com/zapty/forever-service)
