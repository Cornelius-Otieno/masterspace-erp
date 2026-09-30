#!/bin/bash
echo "--- clocksource ---"
cat /sys/devices/system/clocksource/clocksource0/current_clocksource
cat /sys/devices/system/clocksource/clocksource0/available_clocksource
echo "--- dmesg tsc/clock ---"
dmesg -T 2>/dev/null | grep -iE 'tsc|clocksource|unstable' | tail -n 20
