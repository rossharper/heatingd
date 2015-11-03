var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

module.exports = {
    isFirstDateBeforeSecondDate : function(firstDate, secondDate) {
        return firstDate.getTime() < secondDate.getTime();
    },
    getDateFromTimeStr : function(date, timeStr) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(timeStr.substr(0,2)), parseInt(timeStr.substr(3,2)), 0);
    },
    getDayOfWeek : function(date) {
        return DAYS[date.getDay()];
    }
}
