<!--#include file="Programica.thin.js" -->

<!--#if expr="$HTTP_USER_AGENT = /Gecko\//" -->
	<!--#include file="Programica/FFFixes.js" -->
<!--#endif -->

<!--#if expr="$HTTP_USER_AGENT = /MSIE/" -->
	<!--#include file="Programica/IEFixes.js" -->
	<!--#include file="Programica/IEXPath.js" -->
<!--#endif -->

<!--#if expr="$HTTP_USER_AGENT = /AppleWebKit\/4/" -->
	<!--#include file="Programica/WK4Fixes.js" -->
<!--#endif -->

<!--#include file="Programica/DOM.js" -->
<!--#include file="Programica/Animation.js" -->
<!--#include file="Programica/Request.js" -->
<!--#include file="Programica/Form.js" -->
<!--#include file="Programica/Widget.js" -->