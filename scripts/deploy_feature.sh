#!/bin/bash

# ==========================================
# 🚀 DEPLOYMENT PROTOCOL: PHASE 16.1
# ==========================================

BRANCH_NAME="feature/phase-16-firestore"
COMMIT_MSG="feat(db): initialize firestore schema, seeding tool, and vite fix"

echo "🔍 Checking Git Status..."
if [ -n "$(git status --porcelain)" ]; then 
    echo "⚠️  Uncommitted changes detected. Staging them now..."
else
    echo "✅ Working directory clean."
fi

# 1. Create/Switch Branch
echo "🌿 Switching to branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME 2>/dev/null || git checkout $BRANCH_NAME

# 2. Stage & Commit
echo "📦 Staging files..."
git add .

echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG"

# 3. Push to Origin
echo "🚀 Pushing to origin..."
git push -u origin $BRANCH_NAME

# 4. Instructions
echo ""
echo "=========================================="
echo "✅ Feature Branch Pushed Successfully!"
echo "=========================================="
echo "👉 Next Steps:"
echo "1. Go to GitHub and open a Pull Request for '$BRANCH_NAME'."
echo "2. Wait for the 'Deploy to Preview Channel' action to pass."
echo "3. Verify the Preview URL provided by the bot."
echo "4. If stable, merge to 'main' to deploy to Production."
echo "=========================================="