# Security Guide

## Security Measures Implemented

### 1. Authentication & Authorization
- **Magic Link Authentication**: Passwordless login via Supabase for secure authentication
- **Row Level Security (RLS)**: Database policies ensure users can only access their own data
  - `user_favorites`: Users can only read/write their own favorites
  - `workout_history`: Users can only read/write their own workout history
- **Session Management**: Supabase handles secure session tokens and automatic refresh

### 2. HTTP Security Headers
Implemented in `next.config.ts`:
- **X-Frame-Options: DENY** - Prevents clickjacking attacks
- **X-Content-Type-Options: nosniff** - Prevents MIME type sniffing
- **Referrer-Policy: strict-origin-when-cross-origin** - Controls referrer information
- **Permissions-Policy** - Restricts access to browser features (camera, microphone, geolocation)

### 3. Rate Limiting
- Auth endpoints limited to 5 requests per 15 minutes per IP
- Prevents brute force attacks on authentication
- Implemented in `middleware.ts`

### 4. Input Validation
- Auth callback validates code format before processing
- Error handling with graceful redirects
- Prevents code injection attacks

### 5. Environment Variables
- All secrets stored in `.env.local` (not committed to Git)
- `.gitignore` configured to exclude all `.env*` files
- Vercel environment variables for production

## Vercel Deployment Security Checklist

Before deploying, ensure:

1. **Environment Variables Set in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Supabase Security Settings**:
   - Verify RLS is enabled on all tables
   - Check Auth settings → Email Templates for branding
   - Configure site URL in Supabase Auth settings
   - Add Vercel URL to allowed redirect URLs

3. **HTTPS Enabled**:
   - Vercel automatically provides HTTPS
   - Verify in deployment settings

## Supabase RLS Policies

### user_favorites Table
```sql
-- Users can only insert their own favorites
CREATE POLICY "Users can insert own favorites"
ON user_favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only view their own favorites
CREATE POLICY "Users can view own favorites"
ON user_favorites FOR SELECT
USING (auth.uid() = user_id);

-- Users can only delete their own favorites
CREATE POLICY "Users can delete own favorites"
ON user_favorites FOR DELETE
USING (auth.uid() = user_id);
```

### workout_history Table
```sql
-- Users can only insert their own history
CREATE POLICY "Users can insert own history"
ON workout_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only view their own history
CREATE POLICY "Users can view own history"
ON workout_history FOR SELECT
USING (auth.uid() = user_id);
```

## Security Best Practices

### For Development
1. Never commit `.env` files to Git
2. Use `.env.local` for local development
3. Keep dependencies updated: `npm audit` and `npm audit fix`
4. Review Supabase logs regularly

### For Production
1. Monitor Vercel deployment logs
2. Set up error tracking (e.g., Sentry)
3. Review Supabase Auth logs for suspicious activity
4. Keep Next.js and dependencies updated
5. Enable Vercel's Web Application Firewall (paid feature)

## Potential Future Enhancements

### High Priority
- [ ] Implement CSRF tokens for state-changing operations
- [ ] Add Content Security Policy (CSP) headers
- [ ] Set up monitoring and alerting for security events
- [ ] Add email verification flow

### Medium Priority
- [ ] Implement 2FA (two-factor authentication)
- [ ] Add session timeout and automatic logout
- [ ] Implement proper Redis-based rate limiting for production
- [ ] Add IP-based blocking for repeated violations

### Low Priority
- [ ] Add security audit logging
- [ ] Implement honeypot fields for forms
- [ ] Add CAPTCHA for repeated failed login attempts

## Reporting Security Issues

If you discover a security vulnerability, please email: [your-email@example.com]

**Please do not open public issues for security vulnerabilities.**

## Dependencies Security

Run regular security audits:
```bash
npm audit
npm audit fix
```

Check for outdated packages:
```bash
npm outdated
```

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Supabase Security Documentation](https://supabase.com/docs/guides/auth/row-level-security)
