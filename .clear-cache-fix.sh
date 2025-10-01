#!/bin/bash
# Script to completely clear Next.js cache and rebuild

echo "🧹 Clearing Next.js cache..."

# Remove .next directory
rm -rf .next

# Remove node_modules/.cache
rm -rf node_modules/.cache

# Remove out directory if exists
rm -rf out

# Clear npm cache
echo "📦 Clearing npm cache..."
npm cache clean --force 2>/dev/null || true

echo "✅ Cache cleared successfully!"
echo "🔨 Now rebuild with: npm run build"

