if (!/привет/i.test("Привет"))
{
	RegExp.prototype.__pmc_test = RegExp.prototype.test
	RegExp.prototype.test = function (str) { return this.__pmc_test(this.ignoreCase ? String(str).toLowerCase() : str) }
}
