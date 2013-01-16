Element.prototype.animate = function () { return Liby.Animation.animate(this, motion, props, duration, unit) }

Array.prototype.randomize = function () { return Liby.ArrayRandom.randomize(this) }
Array.prototype.random = function (n) { return Liby.ArrayRandom.random(this, n) }
