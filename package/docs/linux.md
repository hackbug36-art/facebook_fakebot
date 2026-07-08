# Linux Installation Guide

## Method 1: Quick Install (Recommended)

```bash
# Clone the repository
git clone https://github.com/hackbug36-art/facebook_fakebot.git
cd facebook_fakebot

# Run universal installer
bash package/scripts/install.sh

# Start the server
npm start
```

## Method 2: Manual Install

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/hackbug36-art/facebook_fakebot.git
cd facebook_fakebot
npm install

# Start
npm start
```

## Method 3: Docker

```bash
# Build and run with Docker
docker build -t facebook-fakebot ./package/docker
docker run -p 8080:8080 -v $(pwd)/data:/app/data facebook-fakebot

# Or use docker-compose
docker-compose -f package/docker/docker-compose.yml up
```

## Method 4: Desktop App (Electron)

```bash
# Install desktop dependencies
cd package/desktop
npm install

# Build for Linux
npm run build:linux

# Or run in development
npm run dev
```

## Method 5: Mobile (Android via Termux)

```bash
# In Termux
pkg update && pkg upgrade
pkg install nodejs npm git ffmpeg

# Clone and setup
git clone https://github.com/hackbug36-art/facebook_fakebot.git
cd facebook_fakebot
bash package/scripts/install.sh

# Start server
npm start
```

## Access

Open browser: http://localhost:8080

Default admin: `admin` / `admin`
