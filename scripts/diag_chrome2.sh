#!/bin/bash
cd /tmp/pptest
CHROME_BIN=$(node -e "console.log(require('puppeteer').executablePath())")
echo "Chrome path: $CHROME_BIN"
timeout 20 "$CHROME_BIN" --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --dump-dom about:blank > /tmp/t10.log 2>&1
echo "EXIT $?"
cat /tmp/t10.log
