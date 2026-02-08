#!/bin/bash

echo "🧪 Testing Authentication API..."
echo ""

# Test login endpoint
echo "📝 Testing POST /api/auth/login..."
# SECURITY: Use environment variables for test credentials
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@motoroctane.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin@123}"
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
  -w "\nHTTP Status: %{http_code}\n" \
  2>/dev/null

echo ""
echo "✅ If you see JSON with 'success: true', the API is working!"
echo "❌ If you see HTML or 404, restart the backend server."
