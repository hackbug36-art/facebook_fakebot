# Android Installation Guide

## Method 1: Termux (Root/Non-Root)

```bash
# Update Termux
pkg update && pkg upgrade

# Install dependencies
pkg install nodejs npm git ffmpeg python

# Clone repository
git clone https://github.com/hackbug36-art/facebook_fakebot.git
cd facebook_fakebot

# Run installer
bash package/scripts/install.sh

# Start server
npm start

# Access via browser
# Open http://localhost:8080 in any browser
```

## Method 2: React Native App (APK)

### Prerequisites
- Android Studio
- Java JDK 11+
- Android SDK

### Build Steps

```bash
# Install React Native CLI
npm install -g @react-native-community/cli

# Setup mobile app
cd package/mobile
npm install

# For Android
npm run android

# Or build APK
npm run build:android
# APK will be in: android/app/build/outputs/apk/
```

### Manual APK Build

```bash
cd package/mobile/android
./gradlew assembleRelease
```

## Method 3: Docker (if device supports)

```bash
# Install Termux:Docker
pkg install docker

# Run container
docker run -p 8080:8080 -v /sdcard/fakebot/data:/app/data facebook-fakebot
```

## Access

- **Browser:** http://localhost:8080
- **Mobile App:** Install APK from `android/app/build/outputs/apk/`

Default admin: `admin` / `admin`
