#!/bin/bash

# ==========================================
# 🔒 Phase 4: Security & Initial Launch
# ==========================================

echo "Step 1: Creating local .env file..."
# This file will hold the actual keys and is IGNORED by git.
cat << 'EOF' > .env
VITE_API_KEY=AIzaSyCK4jjJlVPf7GKO-RzXVPNh6rCbixxD0JI
VITE_AUTH_DOMAIN=ryandouglas-resume.firebaseapp.com
VITE_PROJECT_ID=ryandouglas-resume
VITE_STORAGE_BUCKET=ryandouglas-resume.firebasestorage.app
VITE_MESSAGING_SENDER_ID=603817766226
VITE_APP_ID=1:603817766226:web:427f65b61f9c637731de8b
VITE_MEASUREMENT_ID=G-9TLFR9L57G
EOF

echo "Step 2: Refactoring src/lib/firebase.js to use Environment Variables..."
# We replace hardcoded strings with import.meta.env
cat << 'EOF' > src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Use environment variables (Vite requires VITE_ prefix)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in production/browser)
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, analytics };
EOF

echo "Step 3: Verifying .gitignore..."
# Ensure .env is strictly ignored
if ! grep -q ".env" .gitignore; then
  echo ".env" >> .gitignore
  echo "Added .env to .gitignore"
else
  echo "✅ .env is already ignored."
fi

echo "=========================================="
echo "🔒 Security Configuration Complete"
echo "=========================================="
echo "Ready to push? Run these commands manually:"
echo ""
echo "  git add ."
echo "  git commit -m 'feat: Initial commit with secure config'"
echo "  git branch -M main"
echo "  git remote add origin https://github.com/ryandouglas/interactive-resume.git" 
echo "  git push -u origin main"
echo ""
echo "(Note: Replace 'ryandouglas' in the URL above with your actual GitHub username if different)"