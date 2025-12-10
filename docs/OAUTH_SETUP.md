# OAuth Setup Guide

## Overview
This guide walks you through setting up Google and Facebook OAuth authentication for your Tally app using Supabase.

---

## Prerequisites
- Supabase project created
- Access to Supabase Dashboard
- Google Cloud Console account
- Facebook Developer account

---

## 1. Supabase Configuration

### Enable OAuth Providers

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Enable**
4. Find **Facebook** and click **Enable**

### Configure Redirect URLs

Add these URLs to your Supabase **Allowed Redirect URLs**:

**Development:**
```
http://localhost:3000/auth/callback
```

**Production:**
```
https://yourdomain.com/auth/callback
```

> Replace `yourdomain.com` with your actual domain

---

## 2. Google OAuth Setup

### Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if prompted
6. Select **Web application** as application type
7. Add authorized redirect URIs:
   ```
   https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback
   ```
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

### Add to Supabase

1. Return to Supabase Dashboard
2. Go to **Authentication** → **Providers** → **Google**
3. Paste your **Client ID**
4. Paste your **Client Secret**
5. Click **Save**

---

## 3. Facebook OAuth Setup

### Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Click **My Apps** → **Create App**
3. Select **Consumer** as app type
4. Fill in app details and create
5. In the dashboard, go to **Settings** → **Basic**
6. Copy your **App ID** and **App Secret**

### Configure Facebook Login

1. In your Facebook App dashboard
2. Add **Facebook Login** product
3. Go to **Facebook Login** → **Settings**
4. Add Valid OAuth Redirect URIs:
   ```
   https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback
   ```
5. Save changes

### Add to Supabase

1. Return to Supabase Dashboard
2. Go to **Authentication** → **Providers** → **Facebook**
3. Paste your **App ID** (as Client ID)
4. Paste your **App Secret** (as Client Secret)
5. Click **Save**

---

## 4. Environment Variables

Ensure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
```

---

## 5. Testing

### Test Google OAuth
1. Navigate to `/login` or `/signup`
2. Click **Continue with Google**
3. Sign in with your Google account
4. Verify redirect to `/dashboard`

### Test Facebook OAuth
1. Navigate to `/login` or `/signup`
2. Click **Continue with Facebook**
3. Sign in with your Facebook account
4. Verify redirect to `/dashboard`

---

## Troubleshooting

### Common Issues

**"Invalid redirect URI"**
- Verify the redirect URI in Google/Facebook matches Supabase exactly
- Include `/auth/v1/callback` path

**"Unauthorized domain"**
- Add your domain to Google OAuth consent screen
- For Facebook, ensure app is not in Development Mode for production use

**"401 Unauthorized" from Supabase**
- Check that provider is enabled in Supabase Dashboard
- Verify Client ID and Client Secret are correct

**OAuth popup blocked**
- Ensure popup blockers allow your domain
- Test in incognito/private browsing mode

---

## Production Checklist

Before deploying to production:

- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Add production domain to Google OAuth authorized domains
- [ ] Switch Facebook app from Development to Live mode
- [ ] Test OAuth flow in production environment
- [ ] Verify redirect URLs work with HTTPS

---

## Security Best Practices

1. **Never commit secrets** - Keep Client Secrets in environment variables
2. **Use HTTPS** - OAuth requires secure connections in production
3. **Restrict domains** - Only allow your domains in OAuth settings
4. **Monitor usage** - Check Google/Facebook dashboards for suspicious activity

---

## Need Help?

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
