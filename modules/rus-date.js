;(function(){

var rusMonths = Date.rusMonths = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
Date.prototype.toRusDate = function () { return this.getDate() + ' ' + rusMonths[this.getMonth()] + ' ' + this.getFullYear() }
Date.prototype.toRusDateShort = function () { return this.getDate() + ' ' + rusMonths[this.getMonth()] }

})();