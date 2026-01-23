#!/bin/bash

# ==========================================
# 🚑 Fix: GitHub Action Repository Name
# ==========================================
# Description: Corrects the capitalization of 'FirebaseExtended' in workflow files.

echo "Patching .github/workflows/deploy-preview.yml..."
# Use sed to replace lowercase 'firebase-extended' with 'FirebaseExtended'
# We use a backup extension (.bak) just in case, then remove it for cleanliness
sed -i.bak 's/firebase-extended\/action-hosting-deploy/FirebaseExtended\/action-hosting-deploy/g' .github/workflows/deploy-preview.yml
rm .github/workflows/deploy-preview.yml.bak

echo "Patching .github/workflows/deploy-prod.yml..."
sed -i.bak 's/firebase-extended\/action-hosting-deploy/FirebaseExtended\/action-hosting-deploy/g' .github/workflows/deploy-prod.yml
rm .github/workflows/deploy-prod.yml.bak

echo "=========================================="
echo "✅ Workflows Patched!"
echo "=========================================="
echo "👉 Now run these commands to retry the build:"
echo ""
echo "   git add .github/workflows"
echo "   git commit -m 'fix: Correct casing for Firebase GitHub Action'"
echo "   git push"