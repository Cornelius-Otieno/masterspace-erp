#!/bin/bash
CHROME=/root/.cache/puppeteer/chrome/linux-131.0.6778.85/chrome-linux64/chrome
timeout 15 "$CHROME" --headless --no-sandbox --disable-gpu --disable-dev-shm-usage \
  --disable-background-networking --disable-component-update --disable-domain-reliability \
  --disable-features=NetworkService,NetworkServiceInProcess --no-first-run \
  --disable-sync --disable-default-apps --dump-dom about:blank > /tmp/t13.log 2>&1
echo "EXIT $?"
cat /tmp/t13.log
