<!--#if expr="$HTTP_USER_AGENT = /Gecko\//" --><!--#include file="fixes/Gecko.js" --><!--#endif -->
<!--#if expr="$HTTP_USER_AGENT = /Opera\//" --><!--#include file="fixes/Presto.js" --><!--#endif -->
<!--#if expr="$HTTP_USER_AGENT = /WebKit\//" --><!--#include file="fixes/WebKit.js" --><!--#endif -->

<!--#if expr="$HTTP_USER_AGENT = /MSIE 6/" --><!--# include file="fixes/Trident.XHR.js" --><!--#endif -->
<!--#if expr="$HTTP_USER_AGENT = /MSIE [67]/" --><!--#include file="fixes/Trident.js" --><!--#endif -->
<!--#if expr="$HTTP_USER_AGENT = /MSIE 8/" --><!--#include file="fixes/Trident8.js" --><!--#endif -->
