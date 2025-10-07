# Email Authentication Setup Guide

## Overview
This implementation adds comprehensive email authentication features including:
- Email OTP verification during registration
- Forgot password functionality with email reset links
- Change password option for authenticated users

## Email Configuration Setup

### 1. Gmail App Password Setup
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and generate a password
   - Copy the 16-character password

### 2. Environment Variables
Update your `backend/.env` file with:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
FRONTEND_URL=http://localhost:5173
```

### 3. Alternative Email Services
For other email providers, update `backend/utils/emailService.js`:

**Outlook/Hotmail:**
```javascript
const transporter = nodemailer.createTransporter({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

**Custom SMTP:**
```javascript
const transporter = nodemailer.createTransporter({
    host: 'your-smtp-host.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

## Features Implemented

### 1. Registration with Email OTP
- Users receive a 6-digit OTP via email
- OTP expires in 10 minutes
- Resend OTP functionality with 60-second cooldown
- Email verification required before login

### 2. Forgot Password
- Password reset link sent via email
- Reset token expires in 1 hour
- Secure token-based password reset

### 3. Change Password
- Available for authenticated users
- Requires current password verification
- Accessible via header navigation

## API Endpoints

### Authentication Routes
- `POST /auth/register` - Register with OTP
- `POST /auth/verify-otp` - Verify email OTP
- `POST /auth/resend-otp` - Resend OTP
- `POST /auth/login` - Login (requires verified email)
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/change-password` - Change password (authenticated)

## Frontend Routes
- `/register` - Registration form
- `/verify-otp` - OTP verification
- `/login` - Login form with forgot password link
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password with token
- `/change-password` - Change password (protected)

## Security Features
- Secure OTP generation
- Token-based password reset
- Password hashing with bcrypt
- Email verification requirement
- Protected routes for authenticated users

## Testing
1. Start the backend server
2. Configure email credentials
3. Register a new user
4. Check email for OTP
5. Verify email and login
6. Test forgot password flow
7. Test change password functionality