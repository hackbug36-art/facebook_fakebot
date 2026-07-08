# Windows Installation Guide

## Method 1: Quick Install (PowerShell)

```powershell
# Clone the repository
git clone https://github.com/hackbug36-art/facebook_fakebot.git
cd facebook_fakebot

# Run universal installer (requires Git Bash or WSL)
bash package/scripts/install.sh

# Start the server
npm start
```

## Method 2: Manual Install

1. **Install Node.js 18+**
   - Download from https://nodejs.org/
   - Or use Chocolatey: `choco install nodejs`

2. **Install Git**
   - Download from https://git-scm.com/
   - Or use Chocolatey: `choco install git`

3. **Clone and Setup**
   ```powershell
   git clone https://github.com/hackbug36-art/facebook_fakebot.git
   cd facebook_fakebot
   npm install
   npm start
   ```

## Method 3: Docker Desktop

1. Install Docker Desktop from https://www.docker.com/products/docker-desktop
2. Run:
   ```powershell
   docker build -t facebook-fakebot ./package/docker
   docker run -p 8080:8080 facebook-fakebot
   ```

## Method 4: Desktop App (Electron)

```powershell
# Install dependencies
cd package/desktop
npm install

# Build for Windows
npm run build:windows

# Or run in development
npm run dev
```

## Access

Open browser: http://localhost:8080

Default admin: `admin` / `admin`
