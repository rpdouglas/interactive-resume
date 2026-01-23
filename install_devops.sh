#!/bin/bash

# ==========================================
# 🚀 Phase 3: DevOps Pipeline Setup
# ==========================================
# Role: Architect & Builder
# Goal: Setup Git + Firebase Hosting + GitHub Actions (CI/CD)

# ANSI Colors for Output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting DevOps Configuration...${NC}"

# ==========================================
# 1. GIT INITIALIZATION
# ==========================================
if [ -d ".git" ]; then
    echo -e "${YELLOW}Git already initialized. Skipping 'git init'.${NC}"
else
    echo "Initializing Git repository..."
    git init -b main
    echo -e "${GREEN}Git initialized.${NC}"
fi

# Create .gitignore (Critical for Node/React)
echo "Creating .gitignore..."
cat << 'EOF' > .gitignore
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production
dist
build

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDEs
.vscode/*
!.vscode/extensions.json
.idea
*.swp
.DS_Store

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
firebase-debug.log*

# Firebase
.firebase
EOF

# ==========================================
# 2. FIREBASE CONFIGURATION
# ==========================================
echo "Creating firebase.json..."
# Configures Firebase to serve the 'dist' folder (Vite default) and handle SPA routing
cat << 'EOF' > firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
EOF

echo "Creating .firebaserc..."
# Placeholder for the project alias. User will update this.
cat << 'EOF' > .firebaserc
{
  "projects": {
    "default": "YOUR_FIREBASE_PROJECT_ID_HERE"
  }
}
EOF

# ==========================================
# 3. GITHUB ACTIONS (The "Preview Channel" Workflow)
# ==========================================
mkdir -p .github/workflows

echo "Creating .github/workflows/deploy-preview.yml..."
# Triggers on Pull Requests -> Deploys to a temporary Preview Channel
cat << 'EOF' > .github/workflows/deploy-preview.yml
name: Deploy to Preview Channel

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  build_and_preview:
    if: '${{ github.event.pull_request.head.repo.full_name == github.repository }}'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Firebase Preview
        uses: firebase-extended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: '${{ secrets.FIREBASE_PROJECT_ID }}'
EOF

echo "Creating .github/workflows/deploy-prod.yml..."
# Triggers on Push to Main -> Deploys to Live Production
cat << 'EOF' > .github/workflows/deploy-prod.yml
name: Deploy to Live Production

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Live
        uses: firebase-extended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: '${{ secrets.FIREBASE_PROJECT_ID }}'
          channelId: live
EOF

# ==========================================
# 4. MANUAL HANDOFF INSTRUCTIONS
# ==========================================
echo -e "\n${GREEN}==============================================${NC}"
echo -e "${GREEN}✅ DevOps Files Generated Successfully!${NC}"
echo -e "${GREEN}==============================================${NC}"
echo -e "\n${YELLOW}⚠️  CRITICAL NEXT STEPS (DO NOT SKIP):${NC}"

echo -e "\n${BLUE}STEP 1: Create Firebase Project${NC}"
echo "   Go to https://console.firebase.google.com and create a new project."
echo "   Copy the Project ID (e.g., 'resume-app-123')."
echo "   Edit the '.firebaserc' file in this folder and paste that ID."

echo -e "\n${BLUE}STEP 2: Create GitHub Repo${NC}"
echo "   Create a new EMPTY repository on GitHub."
echo "   Run these commands:"
echo "     git add ."
echo "     git commit -m 'feat: Initial architecture setup'"
echo "     git branch -M main"
echo "     git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git"
echo "     git push -u origin main"

echo -e "\n${BLUE}STEP 3: Configure Secrets (The Bridge)${NC}"
echo "   1. Go to your Firebase Project Settings -> Service Accounts."
echo "   2. Click 'Generate New Private Key'. Use a tool to stringify this JSON into one line (or copy carefully)."
echo "   3. Go to your GitHub Repo -> Settings -> Secrets and variables -> Actions."
echo "   4. Create TWO secrets:"
echo "      - Name: FIREBASE_PROJECT_ID      Value: (Your Project ID)"
echo "      - Name: FIREBASE_SERVICE_ACCOUNT Value: (The entire JSON content of the key file)"

echo -e "\n${GREEN}Once done, your next 'git push' will automatically deploy!${NC}"