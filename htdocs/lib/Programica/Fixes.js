<!--#if expr="$HTTP_USER_AGENT = /Gecko\//" -->
	<!--#include file="FFFixes.js" -->
<!--#endif -->

<!--#if expr="$HTTP_USER_AGENT = /Opera\//" -->
	<!--#include file="OFixes.js" -->
<!--#endif -->

<!--#if expr="$HTTP_USER_AGENT = /MSIE/" -->
	<!--#include file="IEFixes.js" -->
<!--#endif -->


<!--#if expr="$HTTP_USER_AGENT = /AppleWebKit\//" -->
	<!--#include file="WKFixes.js" -->
<!--#endif -->
