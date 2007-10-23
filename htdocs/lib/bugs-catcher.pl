#!/usr/bin/perl

print "Content-type: text/html\n\n";

srand;
$rnd = rand;
$time = localtime;
$fn = "../errors/$time-$rnd.log";

open $f, '>', $fn;
print $f %ENV;
close $f;
