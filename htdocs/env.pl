#!/usr/bin/perl

#use Programica;



print "Content-type: text/html\n\n";

print "<p>\@INC = @INC</p>";

print '<pre>' . `env` . '</pre>';

print '<pre>' . `whoami` . '</pre>';
