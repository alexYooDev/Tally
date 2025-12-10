# Commit Message

```
feat: add Google OAuth authentication with Facebook support ready

- Create reusable OAuthButton component with Google and Facebook branding
- Add signInWithOAuth server action for OAuth flow
- Implement OAuth callback route handler at /auth/callback
- Update login and signup pages with Google OAuth button
- Add comprehensive OAuth setup guide in docs/OAUTH_SETUP.md
- Facebook OAuth ready (commented out, can be enabled after configuration)

OAuth flow: User clicks → Google consent → Callback → Exchange code → Dashboard
```

---

# Alternative (Conventional Commits Format)

```
feat(auth): add Google OAuth with Facebook support ready

Features:
- Google OAuth one-click sign-in on login/signup pages
- OAuth callback handler for code exchange
- Reusable OAuth button components
- Facebook OAuth implemented (commented out pending config)

Docs:
- Comprehensive setup guide in docs/OAUTH_SETUP.md
- Configuration steps for Google Cloud Console
```

---

# Short Version

```
feat: add Google OAuth authentication to login and signup
```
