(function(){

Array.copy = function (s) { var d = []; if (s !== undefined) for (var i = 0, len = s.length; i < len; i++) d[i] = s[i]; return d }

})();