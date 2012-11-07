;(function(){

var proto = Date.prototype

var rusMonths = Date.rusMonths = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
proto.toRusDate = function () { return this.getDate() + ' ' + rusMonths[this.getMonth()] + ' ' + this.getFullYear() }
proto.toRusDateShort = function () { return this.getDate() + ' ' + rusMonths[this.getMonth()] }

})();