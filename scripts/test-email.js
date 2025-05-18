// This script tests the email sending functionality
// Run it with: node scripts/test-email.js

require("dotenv").config({ path: ".env.local" });
const nodemailer = require("nodemailer");

async function main() {
  console.log("Testing email configuration...");

  // Create test account if no credentials are provided
  let testAccount;
  let transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(
      "No email credentials found in .env.local, creating test account..."
    );
    testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log("Using test account:", testAccount.user);
  } else {
    // Use the configured email settings
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Using configured email account:", process.env.EMAIL_USER);
  }

  // Verify the connection
  try {
    await transporter.verify();
    console.log("SMTP connection verified successfully!");
  } catch (error) {
    console.error("SMTP connection failed:", error);
    process.exit(1);
  }

  // Send a test email
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Test Sender" <test@example.com>',
      to: process.env.EMAIL_TO || "test@example.com",
      subject: "PhilosiQ Contact Form - Test Email",
      text: "This is a test email to verify the PhilosiQ contact form notification system.",
      html: `
        <h2>PhilosiQ Email Test</h2>
        <p>This is a test email to verify that the contact form notification system is working correctly.</p>
        <p>If you're seeing this, the email configuration is working!</p>
      `,
    });

    console.log("Test email sent successfully!");
    console.log("Message ID:", info.messageId);

    if (testAccount) {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error("Failed to send test email:", error);
    process.exit(1);
  }
}

main().catch(console.error);
