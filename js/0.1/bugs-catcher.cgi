#!/usr/bin/perl

print "Content-type: text/html\n\n";

# srand;
# $rnd = rand;
my $time = localtime;
# $fn = "../errors/$time-$rnd.log";


my $qs = $ENV{QUERY_STRING};
delete $ENV{QUERY_STRING};
$qs =~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/eg;


my $env = join ';', map { $_ . ': ' . $ENV{$_} } keys %ENV;
$env =~ s/\n//g;


open $f, '>>', '../bugs.log';
print $f join "\n", $time, $qs, $ENV{HTTP_REFERER}, $ENV{HTTP_USER_AGENT}, $ENV{REMOTE_ADDR}, $env;
print $f "\n\n\n";
close $f;
