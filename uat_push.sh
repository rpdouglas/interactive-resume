#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Starting UAT Release Process...${NC}"

# 1. Identify Branch
CURRENT_BRANCH=$(git branch --show-current)

# 2. Guardrail: Main Branch Check
if [ "$CURRENT_BRANCH" == "main" ]; then
  echo -e "${RED}❌ ERROR: You are on 'main'. Please checkout your feature branch first.${NC}"
  exit 1
fi

# 3. Guardrail: Uncommitted Changes Check
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${RED}⚠️  You have uncommitted changes!${NC}"
  git status --short
  echo ""
  read -p "Do you want to commit these changes now? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter commit message: " COMMIT_MSG
    git add .
    git commit -m "$COMMIT_MSG"
    echo -e "${GREEN}✅ Changes committed.${NC}"
  else
    echo -e "${RED}🛑 Cannot push without committing. Aborting.${NC}"
    exit 1
  fi
fi

# 4. User Verification
echo -e "\nYou are about to push feature branch: ${GREEN}$CURRENT_BRANCH${NC}"
read -p "Are you sure you want to proceed to UAT? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}🛑 Process Aborted.${NC}"
    exit 1
fi

# 5. Push Code
echo -e "\n${YELLOW}📦 Pushing code to origin...${NC}"
git push -u origin "$CURRENT_BRANCH"

# 6. Create Pull Request
echo -e "\n${YELLOW}🔀 Opening Pull Request...${NC}"
if gh pr view "$CURRENT_BRANCH" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PR already exists. Updating...${NC}"
else
    # Create PR and capture the URL
    gh pr create --title "feat: $CURRENT_BRANCH" --fill
fi

# 7. Success
echo -e "\n${GREEN}✅ UAT Phase Initiated!${NC}"
echo "---------------------------------------------------"
echo -e "👀 View PR Status:"
gh pr view --json url -q .url
echo "---------------------------------------------------"