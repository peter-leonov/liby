<!--#if expr="$HTTP_USER_AGENT = /Gecko\//" --><!--#include virtual="fixes/Gecko.js" --><!--#endif -->
<!--#if expr="$HTTP_USER_AGENT = /Opera\//" --><!--#include virtual="fixes/Presto.js" --><!--#endif -->
<!--#if expr="$HTTP_USER_AGENT = /WebKit\//" --><!--#include virtual="fixes/WebKit.js" --><!--#endif -->

<!--#if expr="$HTTP_USER_AGENT = /MSIE [67]/" -->
<!--#include virtual="fixes/Trident.XHR.js" -->
<!--#include virtual="fixes/Trident.js" -->
<!--#endif -->
<!--#if expr="$HTTP_USER_AGENT = /MSIE 8/" --><!--#include virtual="fixes/Trident8.js" --><!--#endif -->
