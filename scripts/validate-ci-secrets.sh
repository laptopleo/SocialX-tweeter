#!/bin/bash

echo "🔍 Validating CI/CD Environment Variables..."
echo "============================================="

# Required secrets list
REQUIRED_SECRETS=(
    "DATABASE_URL"
    "DIRECT_DATABASE_URL"
    "AUTH_SECRET"
    "NEXT_PUBLIC_APP_URL"
    "PUSHER_APP_ID"
    "PUSHER_KEY"
    "PUSHER_SECRET"
    "PUSHER_CLUSTER"
    "NEXT_PUBLIC_PUSHER_KEY"
    "NEXT_PUBLIC_PUSHER_CLUSTER"
    "STRIPE_API_KEY"
    "STRIPE_WEBHOOK_SECRET"
    "GEMINI_API_KEY"
    "NEXT_PUBLIC_TENOR_API_KEY"
    "NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY"
)

MISSING_SECRETS=()
FOUND_SECRETS=()

echo "Checking secrets..."

# Check each required secret
for SECRET in "${REQUIRED_SECRETS[@]}"; do
    # Try to get from GitHub CLI first
    SECRET_VALUE=$(gh secret get "$SECRET" --repo your-username/SocialX-tweeter 2>/dev/null)
    
    if [ -n "$SECRET_VALUE" ] && [ "$SECRET_VALUE" != "null" ]; then
        FOUND_SECRETS+=("$SECRET")
        echo "✅ $SECRET - Set"
    else
        MISSING_SECRETS+=("$SECRET")
        echo "❌ $SECRET - Missing"
    fi
done

echo ""
echo "📊 Summary:"
echo "==========="
echo "✅ Found: ${#FOUND_SECRETS[@]}/${#REQUIRED_SECRETS[@]} secrets"
echo "❌ Missing: ${#MISSING_SECRETS[@]} secrets"

if [ ${#MISSING_SECRETS[@]} -eq 0 ]; then
    echo ""
    echo "🎉 All secrets are properly configured!"
    echo "Your CI/CD pipeline should work correctly."
else
    echo ""
    echo "🔧 Missing secrets that need to be added:"
    for SECRET in "${MISSING_SECRETS[@]}"; do
        echo "   • $SECRET"
    done
    echo ""
    echo "Run: gh secret set $SECRET --body='your_value_here'"
fi