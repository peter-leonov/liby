#ifdef Gecko
#include "Fixes/Gecko.js"
#endif

#ifdef Opera
#include "Fixes/Presto.js"
#endif

#ifdef MSIE
#include "Fixes/Trident.js"
#endif

#ifdef WebKit
#include "Fixes/WebKit.js"
#endif