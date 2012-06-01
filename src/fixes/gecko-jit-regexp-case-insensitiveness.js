if (!/привет/i.test("Привет"))
{
	RegExp.prototype.__liby_test = RegExp.prototype.test
	RegExp.prototype.test = function (str) { return this.__liby_test(this.ignoreCase ? String(str).toLowerCase() : str) }
}
