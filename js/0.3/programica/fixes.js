<!--#if expr="$HTTP_USER_AGENT = /Gecko\//" --><!--#include file="fixes/gecko.js" --><!--#endif -->
<!--#if expr="$HTTP_USER_AGENT = /Opera\//" --><!--#include file="fixes/presto.js" --><!--#endif -->
<!--#if expr="$HTTP_USER_AGENT = /WebKit\//" --><!--#include file="fixes/webkit.js" --><!--#endif -->

<!--#if expr="$HTTP_USER_AGENT = /MSIE 6\./" -->
<!--#include file="fixes/trident3.xhr.js" -->
<!--#include file="fixes/trident3.js" -->
<!--#endif -->

<!--#if expr="$HTTP_USER_AGENT = /MSIE 7\./" -->
<!--#include file="fixes/trident3.js" -->
<!--#endif -->

<!--#if expr="$HTTP_USER_AGENT = /MSIE 8\./" -->
<!--#include file="fixes/trident4.js" -->
<!--#endif -->
