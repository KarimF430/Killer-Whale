#!/bin/bash

# Script to populate production Redis cache with YouTube data
# Run this on your Render backend service

echo "🚀 Populating production Redis cache..."

# Navigate to backend directory
cd "$(dirname "$0")/.."

# Run the trigger script
npx tsx scripts/trigger-youtube-fetch.ts

echo "✅ Done! Check your Vercel deployment - videos should now appear."
