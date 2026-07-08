# macOS Installation Guide

## Method 1: Quick Install (Terminal)

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
# Install Node.js using Homebrew
brew install node

# Clone and setup
git clone https://github.com/hackbug36-art/facebook_fakebot.git
cd facebook_fakebot
npm install
npm start
```

## Method 3: Docker

```bash
# Build and run with Docker
docker build -t facebook-fakebot ./package/docker
docker run -p 8080:8080 -v $(pwd)/data:/app/data facebook-fakebot
```

## Method 4: Desktop App (Electron)

```bash
# Install dependencies
cd package/desktop
npm install

# Build for macOS
npm run build:mac

# Or run in development
npm run dev
```

## Method 5: Mobile (iOS Simulator)

```bash
# Install React Native CLI
npm install -g @react-native-community/cli

# Setup mobile app
cd package/mobile
npm install
cd ios && pod install && cd ..

# Run iOS simulator
npm run ios
```

## Access

Open browser: http://localhost:8080

Default admin: `admin` / `admin`
