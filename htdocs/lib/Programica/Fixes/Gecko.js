if (self.console && self.console.firebug)
	self.log = function () { console.log.apply(console, arguments) }

