# Next.js App Router on Netlify: Troubleshooting 404 Errors

This guide addresses the common issue of "Page not found" errors when deploying Next.js applications with the App Router to Netlify.

## Common Causes of 404 Errors on Netlify

1. **Incorrect build output configuration**
2. **Misconfigured Netlify plugin**
3. **Missing or incorrect redirects**
4. **Edge function configuration issues**
5. **Environment variable problems**

## Step 1: Verify Your Next.js Configuration

Your `next.config.js` should include the `output: 'standalone'` option:

```js
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: 'standalone',
  // other config...
}
```

This creates a standalone build which works better with Netlify's deployment process.

## Step 2: Check Your Netlify Configuration

Your `netlify.toml` should have:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
  [plugins.inputs]
    enable_edge_function = true
    debug = true
    enable_isr = true

[context.production]
  environment = { NODE_VERSION = "18" }
```

Key settings:
- Using `.next` as the publish directory
- Enabling edge functions for the Next.js plugin
- Setting Node.js version to 18 or newer

## Step 3: Set Up Redirects

Create a file at `public/_redirects` with:

```
# Main route fallback for client-side navigation
/*    /.netlify/functions/next    200

# Handle 404 errors with custom not-found page
/404    /404.html    404
```

This ensures proper routing for both client-side navigation and server-rendered pages.

## Step 4: Check Environment Variables

Make sure all environment variables used in your Next.js app are also defined in Netlify:

1. Go to Site settings > Environment variables in the Netlify dashboard
2. Add all variables from your `.env` file
3. Ensure that variables starting with `NEXT_PUBLIC_` are accessible to the client

## Step 5: Verify Server-Side Rendering

Next.js 13+ App Router relies heavily on server components. Ensure:

1. Edge functions are enabled in your Netlify configuration
2. The Netlify Next.js plugin is correctly installed
3. You're not hitting any API limits with the free tier of Netlify

## Step 6: Test with a Clean Deployment

Use our `deploy-netlify-nextjs-fix.sh` script to:

1. Clean previous builds
2. Apply necessary configurations
3. Build with the standalone output
4. Deploy with correct settings

```bash
./deploy-netlify-nextjs-fix.sh
```

## Step 7: Check Netlify Logs

If issues persist:

1. Go to your Netlify dashboard
2. Navigate to your site's Deploys section
3. Click on the most recent deployment
4. Check both build logs and function logs for errors

## Step 8: Edge Cases to Consider

- **Large pages**: Netlify has function size limits
- **API routes complexity**: Complex API routes might need special handling
- **Custom server features**: Not all Next.js custom server features are supported
- **Dependencies issues**: Some npm packages might cause issues in Netlify's environment

## Step 9: Troubleshooting Commands

Try these commands locally to debug:

```bash
# Clear cache and rebuild
rm -rf .next
npm run build

# Test with Netlify dev locally
netlify dev

# Check for plugin issues
netlify build --debug

# Test with Node.js 18 explicitly
nvm use 18  # if you use nvm
NODE_ENV=production npm run build
```

If you've followed all these steps and still encounter issues, consider opening a support ticket with Netlify or posting on their community forums with specific error messages from your logs.
