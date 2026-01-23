#!/bin/bash

# ==========================================
# 🔥 Firebase Configuration Update
# ==========================================

# 1. Update Project Alias (Crucial for Hosting Deployment)
echo "Updating .firebaserc with project ID..."
cat << 'EOF' > .firebaserc
{
  "projects": {
    "default": "ryandouglas-resume"
  }
}
EOF

# 2. Install Firebase Client SDK
echo "Installing firebase npm package..."
npm install firebase

# 3. Create Frontend Configuration File
# We'll put this in src/lib so it's clean and importable
echo "Creating src/lib directory..."
mkdir -p src/lib

echo "Creating src/lib/firebase.js..."
cat << 'EOF' > src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCK4jjJlVPf7GKO-RzXVPNh6rCbixxD0JI",
  authDomain: "ryandouglas-resume.firebaseapp.com",
  projectId: "ryandouglas-resume",
  storageBucket: "ryandouglas-resume.firebasestorage.app",
  messagingSenderId: "603817766226",
  appId: "1:603817766226:web:427f65b61f9c637731de8b",
  measurementId: "G-9TLFR9L57G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in production to avoid local noise)
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, analytics };
EOF

echo "=========================================="
echo "✅ Firebase Configured!"
echo "👉 Your Project ID 'ryandouglas-resume' is now linked."
echo "=========================================="
echo "⚠️  REMINDER: You still need to add the secrets to GitHub!"
echo "   1. FIREBASE_PROJECT_ID: ryandouglas-resume"
echo "   2. FIREBASE_SERVICE_ACCOUNT: (The JSON key you generate in Google Cloud Console)"