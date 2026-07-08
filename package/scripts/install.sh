#!/bin/bash
# Universal Installation Script for Facebook FakeBot
# Supports: Linux, macOS, Windows (WSL/Git Bash), Android (Termux), iOS (iSH)

set -e

echo "=========================================="
echo "  Facebook FakeBot Universal Installer"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Detect OS
detect_os() {
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    if [ -f "/data/data/com.termux/files/usr/bin/bash" ]; then
      OS="termux"
    fi
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
  else
    OS="unknown"
  fi
  echo -e "${GREEN}Detected OS: $OS${NC}"
}

# Check requirements
check_requirements() {
  echo -e "${YELLOW}Checking requirements...${NC}"
  
  # Check Node.js
  if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js $NODE_VERSION${NC}"
  else
    echo -e "${RED}✗ Node.js not found. Installing...${NC}"
    install_nodejs
  fi
  
  # Check npm
  if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm $NPM_VERSION${NC}"
  else
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
  fi
  
  # Check git
  if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓ $GIT_VERSION${NC}"
  else
    echo -e "${RED}✗ git not found. Please install git first.${NC}"
    exit 1
  fi
}

# Install Node.js
install_nodejs() {
  if [[ "$OS" == "linux" ]]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
  elif [[ "$OS" == "macos" ]]; then
    brew install node
  elif [[ "$OS" == "termux" ]]; then
    pkg install nodejs npm
  fi
}

# Install dependencies
install_dependencies() {
  echo -e "${YELLOW}Installing dependencies...${NC}"
  npm install
  echo -e "${GREEN}✓ Dependencies installed${NC}"
}

# Setup environment
setup_environment() {
  echo -e "${YELLOW}Setting up environment...${NC}"
  
  if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
  else
    echo -e "${YELLOW}! .env already exists${NC}"
  fi
  
  # Create upload directories
  mkdir -p uploads/media/videos
  mkdir -p uploads/media/music
  mkdir -p uploads/media/thumbnails
  mkdir -p uploads/media/avatars
  echo -e "${GREEN}✓ Created upload directories${NC}"
}

# Initialize database
init_database() {
  echo -e "${YELLOW}Initializing database...${NC}"
  
  mkdir -p data
  mkdir -p engine/data
  
  # Create default data files if not exist
  if [ ! -f data/users.json ]; then
    echo "[]" > data/users.json
  fi
  
  if [ ! -f data/posts.json ]; then
    echo "[]" > data/posts.json
  fi
  
  echo -e "${GREEN}✓ Database initialized${NC}"
}

# Setup Git
setup_git() {
  echo -e "${YELLOW}Setting up Git...${NC}"
  
  if [ ! -d .git ]; then
    git init
    git config user.email "hackbug36@gmail.com"
    git config user.name "hackbug36"
    echo -e "${GREEN}✓ Git initialized${NC}"
  else
    echo -e "${YELLOW}! Git already initialized${NC}"
  fi
}

# Main installation
main() {
  detect_os
  check_requirements
  setup_git
  install_dependencies
  setup_environment
  init_database
  
  echo ""
  echo -e "${GREEN}=========================================="
  echo "  Installation Complete!"
  echo "==========================================${NC}"
  echo ""
  echo -e "${YELLOW}To start the server:${NC}"
  echo "  npm start"
  echo ""
  echo -e "${YELLOW}Or using docker:${NC}"
  echo "  npm run build:docker"
  echo "  npm run docker:run"
  echo ""
  echo -e "${YELLOW}Default admin account:${NC}"
  echo "  Username: admin"
  echo "  Password: admin"
  echo ""
  echo -e "${YELLOW}Access at:${NC}"
  echo "  http://localhost:8080"
  echo ""
  echo -e "${GREEN}For mobile/desktop apps, see:${NC}"
  echo "  package/mobile/ - React Native app"
  echo "  package/desktop/ - Electron app"
  echo ""
}

main
