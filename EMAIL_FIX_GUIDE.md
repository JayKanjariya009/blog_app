# Email Fix Guide - Blog App

## Problem
Emails are not being sent for forgot password functionality due to Gmail SMTP authentication failure.

**Error:** `535-5.7.8 Username and Password not accepted`

## Root Cause
- Invalid or expired Gmail App Password
- Incorrect SMTP configuration

## Solution Steps

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Factor Authentication if not already enabled

### Step 2: Generate Gmail App Password
1. In Google Account Settings, go to **Security**
2. Click **2-Step Verification**
3. Scroll down and click **App passwords**
4. Select **Mail** as the app
5. Generate a new 16-character app password
6. **Copy this password immediately** (you won't see it again)

### Step 3: Update Environment Variables
Edit your `.env` file in the backend folder:

```env
EMAIL_USER=jaykanjariya009@gmail.com
EMAIL_PASS=your-16-character-app-password-here
FRONTEND_URL=http://localhost:5173
```

### Step 4: Restart Backend Server
```bash
cd backend
npm run dev
```

### Step 5: Test Email Functionality
1. Go to forgot password page
2. Enter your email address
3. Check if email is received

## Alternative SMTP Settings
If Gmail still doesn't work, try these settings in `emailService.js`:

```javascript
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

## Troubleshooting

### Common Issues:
- **App password contains spaces**: Remove all spaces from the app password
- **Using regular password**: Must use App Password, not your Gmail password
- **2FA not enabled**: App passwords only work with 2-Factor Authentication enabled
- **Firewall blocking**: Check if port 465 or 587 is blocked

### Test Email Configuration:
Create a test file to verify email setup:

```javascript
// test-email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Error:', error.message);
    } else {
        console.log('✅ Email server ready');
    }
});
```

Run: `node test-email.js`

## Production Alternatives
For production, consider using:
- **SendGrid**
- **AWS SES**
- **Mailgun**
- **Nodemailer with OAuth2**

These services are more reliable than Gmail SMTP for production applications.

## Security Notes
- Never commit `.env` files to version control
- Use different email credentials for production
- Consider implementing rate limiting for email sending
- Use secure password reset tokens instead of sending passwords via email