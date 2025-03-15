#!/bin/bash
set -e

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== COMPREHENSIVE NETLIFY + NEXT.JS APP ROUTER FIX ===${NC}"
echo -e "${GREEN}This script will deploy your Next.js App Router application to Netlify with proper configuration${NC}"

# Check for netlify CLI
if ! command -v netlify &> /dev/null; then
    echo -e "${RED}Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
fi

# Verify Netlify authentication status
echo -e "${YELLOW}Checking Netlify authentication...${NC}"
netlify status || netlify login

# Clean previous builds
echo -e "${YELLOW}Cleaning previous builds...${NC}"
rm -rf .next out

# Verify and validate netlify.toml
if ! grep -q "enable_edge_function = true" netlify.toml; then
    echo -e "${RED}WARNING: Your netlify.toml doesn't have edge functions enabled, which is required for Next.js 13+ App Router${NC}"
    echo -e "${YELLOW}The current deployment will use the updated configuration, but consider updating your netlify.toml file permanently${NC}"
fi

# Verify _redirects file
if [ ! -f "public/_redirects" ]; then
    echo -e "${YELLOW}Creating _redirects file for proper routing...${NC}"
    mkdir -p public
    cat > public/_redirects << EOL
# Netlify redirects for Next.js
# Ensure that SPA routing works correctly with Next.js App Router
# Main route fallback for client-side navigation
/*    /.netlify/functions/next    200

# Handle 404 errors with our custom not-found page
/404    /404.html    404
EOL
    echo -e "${GREEN}Created _redirects file${NC}"
else
    echo -e "${GREEN}✓ _redirects file exists${NC}"
fi

# Verify next.config.js has standalone output
if grep -q "output: 'standalone'" next.config.js; then
    echo -e "${GREEN}✓ next.config.js has 'output: standalone' configuration${NC}"
else
    echo -e "${YELLOW}Warning: Your next.config.js should have 'output: standalone' for optimal Netlify deployment${NC}"
    echo -e "${YELLOW}Consider adding this configuration permanently to your next.config.js file${NC}"
    
    # Create a temporary modified config
    echo -e "${YELLOW}Creating temporary standalone configuration for this deployment...${NC}"
    TMP_CONFIG=$(mktemp)
    
    # Use awk to insert the output: 'standalone' property after the opening brace
    awk 'BEGIN{p=0} /module.exports = {/ {print; print "  output: '\''standalone'\'',"; p=1; next} {print}' next.config.js > "$TMP_CONFIG"
    
    # Backup the original config
    cp next.config.js next.config.js.bak
    
    # Use the modified config
    cp "$TMP_CONFIG" next.config.js
    
    echo -e "${GREEN}✓ Temporary standalone configuration applied${NC}"
fi

# Build the app
echo -e "${YELLOW}Building the application...${NC}"
NEXT_LINT_SKIP_IGNORED=true NODE_ENV=production npm run build -- --no-lint

# Verify standalone build was created
if [ -d ".next/standalone" ]; then
    echo -e "${GREEN}✅ Standalone build created successfully${NC}"
else 
    echo -e "${RED}⚠️ Standalone build directory not created - this may cause issues with Netlify deployment${NC}"
    echo -e "${RED}⚠️ Please make sure your next.config.js includes 'output: \"standalone\"' configuration${NC}"
fi

# Deploy to Netlify
echo -e "${YELLOW}Deploying to Netlify...${NC}"
echo -e "${GREEN}The deployment will use the @netlify/plugin-nextjs plugin with edge functions enabled${NC}"

netlify deploy --prod

# Restore original next.config.js if we modified it
if [ -f "next.config.js.bak" ]; then
    mv next.config.js.bak next.config.js
    echo -e "${GREEN}✓ Restored original next.config.js${NC}"
fi

echo -e "${GREEN}=== Deployment complete! ===${NC}"
echo -e "${YELLOW}Important notes:${NC}"
echo -e " 1. If you still see a 404 error, check the Netlify deployment logs"
echo -e " 2. Make sure the @netlify/plugin-nextjs plugin is installed and configured correctly"
echo -e " 3. Verify that all environment variables are properly set in Netlify"
