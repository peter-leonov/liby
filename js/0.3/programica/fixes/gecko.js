if (self.console && self.console.log && self.console.error)
{
	if (!self.log)
		self.log = function () { self.console.log.apply(self.console, arguments) }
	
	if (!self.reportError)
		self.reportError = function () { self.console.error.apply(self.console, arguments) }
}
else
	self.log = self.reportError = function () {  }

if (!/привет/i.test("Привет"))
{
	RegExp.prototype.__pmc_test = RegExp.prototype.test
	RegExp.prototype.test = function (str) { return this.__pmc_test(this.ignoreCase ? String(str).toLowerCase() : str) }
}
