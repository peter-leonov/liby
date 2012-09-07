;(function(){

var D = Date,
	rusMonths = D.rusMonths = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
	rusMonths2 = D.rusMonths2 = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

D.prototype.toRusDate = function () { return this.getDate() + ' ' + rusMonths2[this.getMonth()] + ' ' + this.getFullYear() }
D.prototype.toRusDateShort = function () { return this.getDate() + ' ' + rusMonths2[this.getMonth()] }

})();