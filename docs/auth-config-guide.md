# Authentication Configuration Guide for HENRY Platform

## 1. Storage Buckets Setup

Run the `storage-setup.sql` script in your Supabase SQL Editor. This will:
- Create all 4 storage buckets
- Set up proper RLS policies
- Configure file size limits and allowed types
- Add automatic logging of uploads

## 2. Enable Email/Password Authentication

### In Supabase Dashboard:

1. **Navigate to Authentication → Providers**
2. **Enable Email Provider:**
   - Toggle "Enable Email Provider" to ON
   - Configure these settings:
     - ✅ Enable Email Confirmations (recommended for production)
     - ✅ Enable Password Recovery
     - Set minimum password length: 8 characters
     - Password requirements: Include uppercase, lowercase, numbers

### Additional Auth Providers (Optional):
- **Google OAuth**: For Google sign-in
- **GitHub**: For developer accounts
- **Microsoft**: For enterprise integration

## 3. Configure Email Templates

### Navigate to Authentication → Email Templates

#### A. Confirmation Email Template
```html
<h2>Welcome to HENRY Platform</h2>
<p>Hello {{ .Email }},</p>
<p>Thank you for registering with the HENRY Veterans Information System.</p>
<p>Please confirm your email address by clicking the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
<p>This link will expire in 24 hours.</p>
<br>
<p>Best regards,<br>HENRY Platform Team</p>
```

#### B. Password Reset Template
```html
<h2>Password Reset Request</h2>
<p>Hello {{ .Email }},</p>
<p>We received a request to reset your password for your HENRY Platform account.</p>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>If you didn't request this, please ignore this email.</p>
<p>This link will expire in 1 hour.</p>
<br>
<p>Best regards,<br>HENRY Platform Team</p>
```

#### C. Magic Link Template
```html
<h2>Your Login Link</h2>
<p>Hello {{ .Email }},</p>
<p>Click the link below to log in to your HENRY Platform account:</p>
<p><a href="{{ .ConfirmationURL }}">Log in to HENRY Platform</a></p>
<p>This link will expire in 1 hour.</p>
<br>
<p>Best regards,<br>HENRY Platform Team</p>
```

#### D. Change Email Template
```html
<h2>Email Change Confirmation</h2>
<p>Hello,</p>
<p>You requested to change your email address for your HENRY Platform account.</p>
<p>Please confirm your new email address by clicking the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email Change</a></p>
<p>This link will expire in 24 hours.</p>
<br>
<p>Best regards,<br>HENRY Platform Team</p>
```

## 4. Configure Auth Settings

### In Authentication → Settings:

#### Site URL
```
https://your-app-domain.com
```

#### Redirect URLs (add all that apply)
```
https://your-app-domain.com/auth/callback
https://your-app-domain.com/dashboard
http://localhost:3000/auth/callback (for development)
```

#### JWT Settings
- JWT Secret: (auto-generated, keep secure)
- JWT Expiry: 3600 (1 hour)

#### User Sessions
- Enable user sessions: ON
- Session timeout: 7 days (adjust as needed)

## 5. Test Authentication Flow

### Create a Test User:
1. Go to Authentication → Users
2. Click "Invite User"
3. Enter test email
4. User receives confirmation email
5. After confirmation, user can log in

### Test in SQL:
```sql
-- Check if user profile was created automatically
SELECT * FROM auth.users LIMIT 1;
SELECT * FROM public.user_profiles LIMIT 1;

-- Verify trigger is working
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

## 6. Security Recommendations

### Rate Limiting
In Authentication → Settings → Security:
- Enable rate limiting
- Max requests per hour: 100 (adjust based on needs)

### Allowed Domains
- Add your production domain
- Add localhost for development

### Password Policy
- Minimum length: 8-12 characters
- Require uppercase and lowercase
- Require numbers
- Consider requiring special characters

### Session Management
- Enable refresh token rotation
- Set appropriate session timeouts
- Enable single session per user (if needed)

## 7. Client-Side Integration Example

### JavaScript/TypeScript:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'your-project-url',
  'your-anon-key'
)

// Sign up
const { user, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password'
})

// Sign in
const { user, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
})

// Sign out
await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

## 8. Monitoring & Logs

### View Auth Logs:
1. Go to Logs → Auth
2. Monitor for:
   - Failed login attempts
   - Successful registrations
   - Password reset requests
   - Suspicious activity

### Set Up Alerts:
- Configure webhooks for auth events
- Set up email notifications for admin actions
- Monitor rate limit violations

## Next Steps

1. ✅ Run `storage-setup.sql` to create buckets
2. ✅ Enable Email authentication in Dashboard
3. ✅ Configure email templates
4. ✅ Set redirect URLs
5. ✅ Test with a real user account
6. ✅ Implement client-side auth flow
7. ✅ Set up monitoring and alerts

Your HENRY Platform is now fully configured with secure authentication and storage!