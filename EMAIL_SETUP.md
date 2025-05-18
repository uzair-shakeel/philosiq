# PhilosiQ Email Notification Setup

This document provides instructions on how to set up email notifications for the PhilosiQ contact form.

## Configuration

Email notifications are sent to `info@philosiq.com` whenever a user submits the contact form. To enable this functionality, you need to configure the email settings in the `.env.local` file.

### Email Environment Variables

The following environment variables need to be set in the `.env.local` file:

```
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=PhilosiQ <your-email@gmail.com>
EMAIL_TO=info@philosiq.com
```

### Using Gmail as SMTP Provider

If you're using Gmail as your SMTP provider, follow these steps:

1. Create or use an existing Gmail account
2. Enable 2-Step Verification for the account
3. Generate an App Password:
   - Go to your Google Account settings
   - Select "Security"
   - Under "Signing in to Google," select "App passwords"
   - Generate a new app password for "Mail" and "Other (Custom name)"
   - Use this generated password as the `EMAIL_PASS` value

### Using Other SMTP Providers

If you're using another email provider, update the `EMAIL_HOST` and `EMAIL_PORT` values according to your provider's SMTP settings.

## Testing Email Functionality

To test if your email configuration is working correctly, run the test script:

```bash
node scripts/test-email.js
```

This script will:

1. Verify the SMTP connection
2. Send a test email to the configured recipient
3. Display the results of the test

## Troubleshooting

If you encounter issues with sending emails:

1. Check that your SMTP credentials are correct
2. Verify that your email provider allows SMTP access
3. If using Gmail, ensure that "Less secure app access" is enabled or that you're using an App Password
4. Check your email provider's documentation for any specific requirements

## Security Considerations

- Never commit your `.env.local` file to version control
- Use environment variables on your production server
- Consider using a dedicated email sending service like SendGrid, Mailgun, or Amazon SES for production use
