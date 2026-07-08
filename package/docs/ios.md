# iOS Installation Guide

## Method 1: Web Access (Safari)

```bash
# On macOS or iOS device with terminal access
git clone https://github.com/hackbug36-art/facebook_fakebot.git
cd facebook_fakebot
bash package/scripts/install.sh
npm start

# Access via Safari
# http://localhost:8080
```

## Method 2: React Native App (IPA)

### Prerequisites
- macOS with Xcode 14+
- CocoaPods
- Apple Developer Account (for device installation)

### Build Steps

```bash
# Install React Native CLI
npm install -g @react-native-community/cli

# Setup mobile app
cd package/mobile
npm install
cd ios && pod install && cd ..

# Run iOS Simulator
npm run ios

# Build IPA for device
npm run build:ios
# IPA will be in: ios/build/
```

## Method 3: TestFlight (Beta Distribution)

```bash
# Build for App Store
cd package/ios
xcodebuild -workspace FacebookFakeBot.xcworkspace \
  -scheme FacebookFakeBot \
  -configuration Release \
  -archivePath ./build/FacebookFakeBot.xcarchive \
  archive

# Export IPA
xcodebuild -exportArchive \
  -archivePath ./build/FacebookFakeBot.xcarchive \
  -exportPath ./build \
  -exportOptionsPlist ExportOptions.plist
```

## Access

- **Safari:** http://localhost:8080
- **iOS App:** Install IPA via TestFlight or Xcode

Default admin: `admin` / `admin`
