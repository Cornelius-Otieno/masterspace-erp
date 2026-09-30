#!/bin/bash
CHROME=/root/.cache/puppeteer/chrome/linux-152.0.7977.75/chrome-linux64/chrome
echo "--- CPU flags ---"
grep -m1 flags /proc/cpuinfo | tr ' ' '\n' | grep -E '^(sse|avx)' | sort -u
echo "--- old headless ---"
timeout 10 "$CHROME" --headless=old --no-sandbox --disable-gpu --disable-dev-shm-usage --dump-dom about:blank > /tmp/t5.log 2>&1
echo "EXIT $?"
cat /tmp/t5.log
echo "--- default headless (no =new/=old) ---"
timeout 10 "$CHROME" --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --dump-dom about:blank > /tmp/t6.log 2>&1
echo "EXIT $?"
cat /tmp/t6.log
