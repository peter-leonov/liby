<!--#include file="Programica/Init.js" -->

<!--#if expr="$HTTP_USER_AGENT = /Gecko\//" -->
	<!--#include file="Programica/FFFixes.js" -->
<!--#endif -->

<!--#if expr="$HTTP_USER_AGENT = /MSIE/" -->
	<!--#include file="Programica/IEFixes.js" -->
<!--#endif -->


<!--#if expr="$HTTP_USER_AGENT = /AppleWebKit\//" -->
	<!--#include file="Programica/WKFixes.js" -->
<!--#endif -->

<!--#include file="Programica/DOM.js" -->
<!--#include file="Programica/Animation.js" -->
<!--#include file="Programica/Draggable.js" -->

<!--#include file="Programica/Request.js" -->
<!--#include file="Programica/Form.js" -->
<!--#include file="Programica/Widget.js" -->

<!--#include file="Programica/Development.js" -->