# Environment Variables Setup Guide

## Required Environment Variables

You need to set up the following environment variables for the application to work properly.

### For Local Development (.env file)

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="mysql://user:password@localhost:3306/database_name"

# JWT Secret Key (for authentication tokens)
JWT_SECRET="your_secret_jwt_key_here_change_this_in_production"

# Email Configuration (SMTP)
MAIL_HOST="smtp.gmail.com"
MAIL_PORT="587"
MAIL_USER="your-email@gmail.com"
MAIL_PASSWORD="your-app-password-here"

# Application Base URL
# For local development
BASE_URL="http://localhost:3000"

# Public Base URL (optional, for client-side use)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Image Upload Configuration
NEXT_PUBLIC_UPLOAD_IMAGE_API="https://your-image-upload-api-url.com/api/upload"
NEXT_PUBLIC_UPLOADED_IMAGE_URL="https://your-image-cdn-url.com"
```

### For Production (Vercel)

In your Vercel project dashboard, set these environment variables:

1. **BASE_URL** = `https://quick-delivery2.vercel.app`
   - This ensures email verification and password reset links use the correct URL
   - The code will auto-detect this, but setting it explicitly is recommended

2. **DATABASE_URL** = Your production database connection string

3. **JWT_SECRET** = A secure random string for JWT token signing

4. **MAIL_HOST** = Your SMTP server (e.g., `smtp.gmail.com`)

5. **MAIL_PORT** = SMTP port (usually `587` for Gmail)

6. **MAIL_USER** = Your email address

7. **MAIL_PASSWORD** = Your email app password (not your regular password)

8. **NEXT_PUBLIC_UPLOAD_IMAGE_API** = Your image upload API endpoint

9. **NEXT_PUBLIC_UPLOADED_IMAGE_URL** = Your CDN/base URL for uploaded images

## Important Notes:

- **VERCEL_URL** is automatically provided by Vercel - you don't need to set it
- The code will automatically use `https://quick-delivery2.vercel.app` in production if BASE_URL is not set
- For email links to work correctly in production, make sure `BASE_URL` is set in Vercel
- Never commit your `.env` file to git (it should be in `.gitignore`)

## Quick Setup Checklist:

✅ Create `.env` file in root directory for local development  
✅ Add all required variables to `.env`  
✅ Set `BASE_URL=https://quick-delivery2.vercel.app` in Vercel  
✅ Set all other environment variables in Vercel dashboard  
✅ Redeploy your application after setting environment variables

