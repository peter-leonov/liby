<!--#if expr="$HTTP_USER_AGENT = /Gecko\//" --><!--#include file="Fixes/Gecko.js" --><!--#endif -->
<!--#if expr="$HTTP_USER_AGENT = /Opera\//" --><!--#include file="Fixes/Presto.js" --><!--#endif -->
<!--#if expr="$HTTP_USER_AGENT = /MSIE [67]/" --><!--#include file="Fixes/Trident.js" --><!--#endif -->
<!--#if expr="$HTTP_USER_AGENT = /MSIE 8/" --><!--#include file="Fixes/Trident8.js" --><!--#endif -->
<!--#if expr="$HTTP_USER_AGENT = /WebKit\//" --><!--#include file="Fixes/WebKit.js" --><!--#endif -->