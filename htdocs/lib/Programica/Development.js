
// чисто для разработчка

Programica.debugLevel = 1

self.addEventListener('keydown', function (e) { if (e.keyCode == 77) (debugModel = $('debug-model')) && debugModel.toggle() }, true)
