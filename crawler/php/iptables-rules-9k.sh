#!/bin/sh

IPT="/sbin/iptables"
IF="eth0"

$IPT -F
#$IPT -F INPUT


# ports 21, 22, 25, 443, 995, 2525[local], 8080
# rtmfp ports: 1935 udp/tcp

# accept self trafic
$IPT -A INPUT -i lo -p all -j ACCEPT
$IPT -A OUTPUT -o lo -p all -j ACCEPT

# accept related
$IPT -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# limit hit rate per IP
$IPT -A INPUT -p tcp -i $IF -m state --state NEW -m recent --set
$IPT -A INPUT -p tcp -i $IF -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP

# accept input for services
$IPT -A INPUT -i $IF -p tcp --dport 9000 -j ACCEPT
$IPT -A INPUT -i $IF -j DROP

# allow output
$IPT -A OUTPUT -o $IF -j ACCEPT

# drop forward
$IPT -A FORWARD -i $IF -j DROP
