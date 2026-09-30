#!/bin/bash
CHROME=/root/.cache/puppeteer/chrome/linux-131.0.6778.85/chrome-linux64/chrome
echo "--- jitless ---"
timeout 15 "$CHROME" --headless --no-sandbox --disable-gpu --js-flags=--jitless --dump-dom about:blank > /tmp/t14.log 2>&1
echo "EXIT $?"; cat /tmp/t14.log
echo "--- no flags at all ---"
timeout 15 "$CHROME" --headless --dump-dom about:blank > /tmp/t15.log 2>&1
echo "EXIT $?"; cat /tmp/t15.log
