#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Starting Production Merge...${NC}"

# 1. Identify Branch
CURRENT_BRANCH=$(git branch --show-current)

# 2. Guardrail
if [ "$CURRENT_BRANCH" == "main" ]; then
  echo -e "${RED}❌ ERROR: You are on 'main'. Please run this from the feature branch you wish to merge.${NC}"
  exit 1
fi

# 3. User Verification (The "Human in the Loop")
echo -e "Target Branch: ${GREEN}$CURRENT_BRANCH${NC}"
echo -e "${YELLOW}⚠️  CRITICAL CHECK:${NC} Did you visit the Firebase Preview URL and verify the features?"
read -p "Type 'yes' to confirm merge to Production: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo -e "${RED}🛑 Merge Aborted. Please verify UAT first.${NC}"
    exit 1
fi

# 4. Merge via GitHub CLI
echo -e "\n${YELLOW}🔀 Merging PR into Main (Squash Strategy)...${NC}"
gh pr merge --squash --delete-branch --admin

# 5. Local Cleanup
echo -e "\n${YELLOW}🧹 Syncing local environment...${NC}"
git checkout main
git pull origin main
git fetch --prune

# 6. Final Status
echo -e "\n${GREEN}✅ Production Deployment Triggered!${NC}"
echo "The 'Deploy to Live' GitHub Action is now running."
echo -e "Monitor it here: https://github.com/rpdouglas/interactive-resume/actions"