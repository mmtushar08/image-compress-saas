# Magic Link Authentication Flow

## Overview
The application now uses **magic link authentication** to prevent fake email abuse. Users must verify their email address before accessing their API keys.

## Flow Diagram

```
User Signup → Email Sent → Click Magic Link → Verify Token → Access Dashboard
```

## Detailed Steps

### 1. User Signs Up
- User visits `/signup` page
- Enters email address
- Clicks "Get Access Link" button
- **NO immediate redirect to dashboard**

### 2. Email Confirmation Screen
- User sees "Check your email" message
- Email address is displayed
- Instructions to click the link in email

### 3. Email Sent
- Welcome email sent with magic link
- Link format: `http://localhost:5173/auth?token=XXXXX&email=user@example.com`
- Token valid for 24 hours

### 4. User Clicks Magic Link
- Opens `/auth` route
- Token is verified on backend
- If valid: User is logged in and redirected to dashboard
- If invalid/expired: Error message shown

### 5. Dashboard Access
- User data stored in localStorage
- API key is now accessible
- User can compress images

## Security Benefits

✅ **Prevents fake emails** - Users must have access to the email account
✅ **Token expiry** - Links expire after 24 hours
✅ **One-time use** - Tokens can be invalidated after first use (optional)
✅ **No password needed** - Passwordless authentication

## API Endpoints

### POST `/api/users/register`
**Request:**
```json
{
  "email": "user@example.com",
  "plan": "free"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Check your email for access link"
}
```

### GET `/api/users/verify-token`
**Query Parameters:**
- `token`: Magic link token
- `email`: User email

**Response (Success):**
```json
{
  "success": true,
  "email": "user@example.com",
  "apiKey": "tr_xxxxx",
  "plan": "free"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid or expired link"
}
```

## Frontend Routes

- `/signup` - Registration form
- `/auth` - Magic link verification handler
- `/dashboard` - User dashboard (requires auth)

## Email Configuration

### Development (Mock Mode)
Emails are logged to console. Check the API server terminal to see:
```
--- MOCK EMAIL SEND ---
To: user@example.com
Subject: Get your Trimixo API key
```

### Production (Real SMTP)
Add to `api/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL="Trimixo Support <support@trimixo.com>"
FRONTEND_URL=https://yourdomain.com
```

## Testing the Flow

### Manual Test
1. Start both servers:
   ```bash
   # Terminal 1 - API
   cd api
   npm start

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

2. Open http://localhost:5173/signup
3. Enter test email
4. Check API terminal for mock email with magic link
5. Copy the magic link URL from console
6. Paste in browser to verify

### Automated Test
```bash
npm test
```

## Database Schema

Users are stored in `api/data/users.json`:

```json
{
  "id": "1234567890",
  "email": "user@example.com",
  "apiKey": "tr_xxxxx",
  "plan": "free",
  "credits": 10,
  "usage": 0,
  "magicToken": "abc123...",
  "tokenExpiry": "2026-01-05T12:00:00.000Z",
  "createdAt": "2026-01-04T12:00:00.000Z",
  "lastResetDate": "2026-01-04T12:00:00.000Z"
}
```

## Email Template

The email matches TinyPNG's style:
- Clean sky-blue gradient header
- Centered "Trimixo" logo
- Green "Visit your dashboard" button
- Friendly, professional copy
- Footer with attribution

## Next Steps (Optional Enhancements)

1. **Token Invalidation**: Clear `magicToken` after first use
2. **Resend Email**: Add button to request new magic link
3. **Rate Limiting**: Prevent email spam
4. **Email Templates**: Add more email types (password reset, plan upgrade, etc.)
5. **Analytics**: Track email open rates and link clicks
