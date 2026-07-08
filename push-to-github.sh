#!/bin/bash
# Push script for facebook_fakebot
# Usage: ./push-to-github.sh "commit message"

cd /home/tukuk/myweb

# Add all changes
git add -A

# Commit with message or default
if [ -z "$1" ]; then
  git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
else
  git commit -m "$1"
fi

# Push to GitHub
git push origin main

echo "Done! pushed to https://github.com/hackbug36-art/facebook_fakebot"
