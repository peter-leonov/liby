if (self.console && self.console.log && self.console.error)
{
	if (!self.log)
		self.log = function () { self.console.log.apply(self.console, arguments) }
	
	if (!self.reportError)
		self.reportError = function () { self.console.error.apply(self.console, arguments) }
}
else
	self.log = self.reportError = function () {  }
