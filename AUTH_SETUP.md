# Authentication setup

The app supports password reset by email and Sign in with Google.

## Server variables (`server/.env`)

```env
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-web-oauth-client-id.apps.googleusercontent.com

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
EMAIL_FROM="Laxsik Ecolodge <no-reply@example.com>"
```

`SMTP_SECURE` should normally be `true` for port 465 and `false` for port 587.

## Client variables (`client/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-web-oauth-client-id.apps.googleusercontent.com
```

Create a **Web application** OAuth client in Google Cloud, then add the local
and production frontend URLs to **Authorized JavaScript origins**. The server
and client Google client IDs must match.

## Existing MongoDB databases

Google-created accounts do not require a phone number. Run this once when
upgrading an existing database so the old `phone_1` unique index becomes a
partial unique index:

```bash
cd server
npm run auth:migrate-indexes
```

This command keeps all user records and only replaces the phone index when it
still has the old non-partial definition.
