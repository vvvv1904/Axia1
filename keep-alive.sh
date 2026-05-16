#!/bin/bash
# Watchdog script to keep Vite server alive on port 3000
# Serves the built static files from /home/z/my-project/axia-vite/dist
while true; do
  cd /home/z/my-project/axia-vite
  npx vite --port 3000 --host 0.0.0.0 2>&1 | tee -a /tmp/vite-axia.log
  echo "[$(date)] Vite server died. Restarting in 3s..." >> /tmp/vite-axia-watchdog.log
  sleep 3
done
