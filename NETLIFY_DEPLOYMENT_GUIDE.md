# Netlify Deployment Guide for pepe-x.app

This guide will walk you through deploying your Next.js application to Netlify and connecting it with your Namecheap domain.

## Prerequisites

- A GitHub repository with your code
- Netlify account
- Namecheap account with the pepe-x.app domain

## Step 1: Push Your Code to GitHub

Make sure your code is in a GitHub repository. Before pushing, verify that your `.env` file is not committed:

1. Confirm `.env` is in your `.gitignore` file (it is)
2. Run `git status` to make sure `.env` is not staged for commit

## Step 2: Set Up Netlify Site

1. Log in to your Netlify account at [netlify.com](https://netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect to your GitHub account
4. Select the repository containing your Next.js app
5. Configure build settings:
   - Build command: `npm run build` (already set in netlify.toml)
   - Publish directory: `.next` (already set in netlify.toml)
   - Click "Deploy site"

## Step 3: Configure Environment Variables in Netlify

Add all the environment variables from your `.env` file to Netlify:

1. Go to Site settings > Environment variables
2. Add each variable individually:

```
# Chain Configuration (Base Sepolia)
NEXT_PUBLIC_CHAIN_ID=84532

# Pepo Token Addresses Base Sepolia
NEXT_PUBLIC_TOKEN_ADDRESS=0xFEf49E624351a107729B727b6CC1b742bef2418d

# Contract Addresses
NEXT_PUBLIC_MULTI_PREDICTION_MARKET_ADDRESS=0x75e6B4B186efaD26eB7c841cF6feEA62CE30A4e0
NEXT_PUBLIC_DUTCH_AUCTION_ADDRESS=0x6b8ecE95bD4d0870F8d11b0F239C7CAB772953eb

# Uniswap Router Address (Base Sepolia)
NEXT_UNISWAP_ROUTER_ADDRESS=0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4

# Chainlink Price Feed Contracts
NEXT_PUBLIC_BTC_USD_PRICE_FEED_ADDRESS=0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298
NEXT_PUBLIC_ETH_USD_PRICE_FEED_ADDRESS=0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1
NEXT_PUBLIC_LINK_USD_PRICE_FEED_ADDRESS=0xb113F5A928BCfF189C998ab20d753a47F9dE5A61
NEXT_PUBLIC_CBETH_ETH_PRICE_FEED_ADDRESS=0x3c65e28D357a37589e1C7C86044a9f44dDC17134

# API Keys
NEXT_PUBLIC_ALCHEMY_API_KEY=FmxX5UknBzoTSkIsIz18Eaugb_9vyYkO
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=6ef9005cd17a1787657af472d61a0a71
NEXT_PUBLIC_COINGECKO_DEMO_API_KEY=CG-947NwSXzvQXFpSJaKrcvfkGr

# Server-side RPC URL
ALCHEMY_RPC_URL=https://base-sepolia.g.alchemy.com/v2/FmxX5UknBzoTSkIsIz18Eaugb_9vyYkO
```

## Step 4: Connect Your Custom Domain

1. In Netlify, go to Site settings > Domain management
2. Click "Add custom domain"
3. Enter your domain: `pepe-x.app` and click "Verify"
4. Choose "Yes, add domain" to confirm

### Step 5: Configure DNS Settings in Namecheap

You have two options for connecting your domain:

#### Option 1: Use Netlify DNS (Recommended)

1. In Netlify, after adding your custom domain, click "Set up Netlify DNS"
2. Follow the instructions to add the Netlify nameservers to your Namecheap domain
3. In Namecheap:
   - Go to Domain List and select pepe-x.app
   - Click "Manage"
   - Navigate to "Nameservers"
   - Select "Custom DNS" from the dropdown
   - Enter Netlify's nameservers:
     ```
     dns1.p05.nsone.net
     dns2.p05.nsone.net
     dns3.p05.nsone.net
     dns4.p05.nsone.net
     ```
   - Click "Save"

#### Option 2: Use Namecheap DNS with CNAME/A Records

If you prefer to keep your DNS with Namecheap:

1. In Netlify, go to Domain settings for your site
2. Look for the "Netlify DNS verification record" - it will be a TXT record
3. In Namecheap:
   - Go to Domain List and select pepe-x.app
   - Click "Manage"
   - Navigate to "Advanced DNS"
   - Add these records:
     - Type: A, Host: @, Value: Netlify's load balancer IP (104.198.14.52)
     - Type: CNAME, Host: www, Value: your-netlify-site-name.netlify.app

## Step 6: Enable HTTPS

Netlify automatically provisions SSL certificates through Let's Encrypt.

1. In Netlify, go to Site settings > Domain management > HTTPS
2. Make sure "Provision SSL Certificate" is enabled

## Step 7: Verify Deployment

1. After DNS propagation (may take up to 48 hours), visit your domain: pepe-x.app
2. Test all functionality to ensure everything works as expected
3. Check the browser console for any errors

## Security Considerations

- Your `.env` file should never be committed to GitHub
- All sensitive API keys should be stored as environment variables in Netlify
- Consider using Netlify's "Sensitive Variable Indicators" feature to mark sensitive values

## Troubleshooting

- If your site doesn't load properly, check Netlify's deployment logs
- For DNS issues, use a tool like [dnschecker.org](https://dnschecker.org) to verify DNS propagation
- For API keys or environment variable issues, check that all variables are correctly set in Netlify

## Best Practices for Future Updates

1. Use Netlify's branch deploys for testing changes before merging to main
2. Set up preview deployments for pull requests
3. Consider configuring build hooks for automatic deployments

Good luck with your deployment!