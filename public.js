// animation.js
Element.prototype.animate = function () { return Liby.Animation.animate(this, motion, props, duration, unit) }

// array-shuffle.js
Array.prototype.random = Liby.ArrayRandom.random
Array.prototype.shuffle = Liby.ArrayRandom.shuffle
