#!/bin/bash
echo "--- /etc/ld.so.preload ---"
cat /etc/ld.so.preload 2>&1
echo "--- file info ---"
ls -la /lib/libgcwrap.so 2>&1
file /lib/libgcwrap.so 2>&1
echo "--- who owns / when installed ---"
stat /lib/libgcwrap.so 2>&1
echo "--- dpkg owner (should be none if injected) ---"
dpkg -S /lib/libgcwrap.so 2>&1
echo "--- strings sample ---"
strings /lib/libgcwrap.so 2>&1 | grep -iE 'pam|version|http|curl|backdoor|shell' | head -n 30
