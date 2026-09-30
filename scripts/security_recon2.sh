#!/bin/bash
echo "=== /etc/cron.hourly/perfclean ==="
cat /etc/cron.hourly/perfclean 2>&1
echo
echo "=== /etc/cron.daily/perfclean ==="
cat /etc/cron.daily/perfclean 2>&1
echo
echo "=== /etc/cron.d/perfclean ==="
cat /etc/cron.d/perfclean 2>&1
echo
echo "=== /root/.config/cron/perfcc ==="
cat /root/.config/cron/perfcc 2>&1
echo
echo "=== ubuntu user details ==="
grep ubuntu /etc/passwd /etc/shadow 2>&1
ls -la /home/ubuntu/.ssh/ 2>&1
cat /home/ubuntu/.ssh/authorized_keys 2>&1
echo
echo "=== docker repo added? check if docker installed intentionally ==="
which docker 2>&1
dpkg -l | grep -i docker 2>&1
