
// чисто для разработчка

Programica.debugLevel = 1

self.addEventListener('keydown', function (e) { var debugModel; if (e.keyCode == 77) (debugModel = $('model')) && debugModel.toggle() }, true)
