#!/bin/bash

set -e

echo "==================================="
echo "  Deploying Ranking BFTC"
echo "==================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if firebase-tools is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}Error: Firebase CLI not installed${NC}"
    echo "Install with: npm install -g firebase-tools"
    exit 1
fi

# Check if logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}Not logged in to Firebase. Starting login...${NC}"
    firebase login
fi

# Clean previous build
echo -e "${YELLOW}Cleaning previous build...${NC}"
rm -rf .next out

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Build the project
echo -e "${YELLOW}Building project...${NC}"
npm run build

# Check if build was successful
if [ ! -d "out" ]; then
    echo -e "${RED}Error: Build failed. 'out' directory not found.${NC}"
    exit 1
fi

# Deploy to Firebase
echo -e "${YELLOW}Deploying to Firebase Hosting...${NC}"
firebase deploy --only hosting

echo ""
echo -e "${GREEN}==================================="
echo "  Deployment complete!"
echo "===================================${NC}"
