#!/bin/bash
# Universal Start Script for Facebook FakeBot

echo "=========================================="
echo "  Starting Facebook FakeBot"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Dependencies not found. Running installation..."
  npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
  echo "Creating .env file..."
  cp .env.example .env
fi

# Create upload directories
mkdir -p uploads/media/videos
mkdir -p uploads/media/music
mkdir -p uploads/media/thumbnails
mkdir -p uploads/media/avatars

# Start server
echo "Starting server on http://localhost:8080"
echo "Default admin: admin / admin"
echo ""
npm start
