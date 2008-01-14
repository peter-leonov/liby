#!/usr/bin/perl

print "Content-type: text/html; charset=utf-8\n\n";

open $f, '<', 'bugs.log';
$/ = undef;
my $data = <$f>;
close $f;

my @recs = split /\n\n\n/, $data;

print '<html><head><script type="text/javascript" src="/lib/standardista-table-sorting.js"></script></head><body>';

print '<table class="sortable"><thead><tr><th>Сайт</th><th>Ошибка</th><th>Дата</th></tr></thead><tbody>';

for my $rec (reverse @recs)
{
	my @flds = split /\n/, $rec;
	
	print
	'
	<tr><td>'.$flds[3].'</td><td>'.$flds[1].'</td><td>'.$flds[0].'</td></tr>
	'
	
}

print '</tbody></table>';

print '</body></html>'