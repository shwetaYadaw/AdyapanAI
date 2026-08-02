# Google OAuth Configuration for Local Development

## Issue: "Error 400: origin_mismatch"

This error occurs when the application URL doesn't match what's registered in Google Cloud Console.

## Solution: Update Google Cloud Console

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Select your project (AdyapanAI or similar)
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID (Web application)

### Step 2: Update Authorized JavaScript Origins

Click on your OAuth Client ID and update the following:

**Authorized JavaScript origins** (add these):
```
http://localhost:3000
http://localhost:5000
http://127.0.0.1:3000
http://127.0.0.1:5000
```

**Authorized redirect URIs** (add these):
```
http://localhost:3000/auth/callback
http://localhost:5000/auth/callback
http://127.0.0.1:3000/auth/callback
http://127.0.0.1:5000/auth/callback
```

### Step 3: Save Changes

Click **Save** and wait a few seconds for changes to take effect.

### Step 4: Test

1. Make sure the app is running on `http://localhost:3000`
2. Try signing in with Google again
3. It should now work without the "origin_mismatch" error

## For Production Deployment

Update the same fields with your production domain:

**Authorized JavaScript origins:**
```
https://adyapan.com
https://www.adyapan.com
https://app.adyapan.com
```

**Authorized redirect URIs:**
```
https://adyapan.com/auth/callback
https://www.adyapan.com/auth/callback
https://app.adyapan.com/auth/callback
```

Then update `apps/web/.env` with:
```
VITE_API_URL=https://api.adyapan.com
VITE_GOOGLE_CLIENT_ID=<your-client-id>
```

And `apps/backend/.env` with:
```
CLIENT_URL=https://adyapan.com
MOBILE_URL=https://app.adyapan.com
```

## Verifying the Configuration

After making changes, verify that:
- ✅ Web app runs on `http://localhost:3000`
- ✅ Backend runs on `http://localhost:5000`
- ✅ Both are registered in Google Cloud Console
- ✅ Browser can access both without CORS errors
- ✅ All question updates are visible (auto-seeded on backend startup)

## If the error persists:

1. Clear browser cache: `Ctrl + Shift + Delete`
2. Close all browser tabs for localhost
3. Wait 2-3 minutes for Google's cache to update
4. Try again in an incognito/private window
