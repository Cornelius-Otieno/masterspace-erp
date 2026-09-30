#!/bin/bash
echo "=== recent logins (last 30) ==="
last -a 2>&1 | head -n 30
echo
echo "=== currently logged in ==="
who 2>&1
echo
echo "=== root crontab ==="
crontab -l 2>&1
echo
echo "=== system-wide cron ==="
ls -la /etc/cron.d/ /etc/cron.daily/ /etc/cron.hourly/ 2>&1
cat /etc/crontab 2>&1
echo
echo "=== users with UID 0 or shell access ==="
grep -E ':0:|/bin/bash|/bin/sh' /etc/passwd 2>&1
echo
echo "=== listening ports ==="
ss -tulpn 2>&1
echo
echo "=== recently modified files in /lib /usr/lib (last 14 days) ==="
find /lib /usr/lib -maxdepth 2 -newer /etc/hostname -mtime -14 -type f 2>&1 | head -n 40
echo
echo "=== recently modified files in /etc (last 14 days) ==="
find /etc -newer /etc/hostname -mtime -14 -type f 2>&1 | head -n 40
echo
echo "=== ssh authorized_keys ==="
cat /root/.ssh/authorized_keys 2>&1
echo
echo "=== bash history tail ==="
tail -n 50 /root/.bash_history 2>&1
