#!/bin/bash
CHROME=/root/.cache/puppeteer/chrome/linux-131.0.6778.85/chrome-linux64/chrome
"$CHROME" --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --dump-dom about:blank > /tmp/hang.log 2>&1 &
PID=$!
echo "PID=$PID"
sleep 4
gdb -p $PID -batch -ex "thread apply all bt" > /tmp/gdb_bt.txt 2>&1
kill -9 $PID 2>/dev/null
echo "--- backtrace (first 80 lines) ---"
head -n 80 /tmp/gdb_bt.txt
