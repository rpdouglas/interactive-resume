#!/bin/bash

# ==========================================
# 🔧 Fix: Migrate to Tailwind CSS v4
# ==========================================

echo "Step 1: Installing Tailwind v4 Vite Plugin..."
npm install @tailwindcss/vite

echo "Step 2: updating vite.config.js..."
cat << 'EOF' > vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
EOF

echo "Step 3: Migrating CSS to v4 Syntax (CSS-First Config)..."
# In v4, we use @import "tailwindcss" and define theme variables directly in CSS
cat << 'EOF' > src/index.css
@import "tailwindcss";

@theme {
  /* Migrate custom colors from tailwind.config.js */
  --color-brand-dark: #0f172a;  /* Slate 900 */
  --color-brand-accent: #3b82f6; /* Blue 500 */
  --color-brand-light: #f8fafc; /* Slate 50 */
  
  /* Migrate font family */
  --font-sans: "Inter", system-ui, sans-serif;
}

/* Apply base styles using the new variables.
   Note: In v4, we use the variables we just defined in the theme.
*/
body {
  background-color: var(--color-brand-light);
  color: var(--color-brand-dark);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
EOF

echo "Step 4: Cleaning up legacy config..."
rm tailwind.config.js
# If a postcss config was auto-generated, remove it too
if [ -f postcss.config.js ]; then
    rm postcss.config.js
fi

echo "=========================================="
echo "✅ Tailwind v4 Configuration Fixed!"
echo "👉 Restart your server: 'npm run dev'"
echo "=========================================="