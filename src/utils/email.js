import nodemailer from "nodemailer";

/**
 * Creates a configured nodemailer transporter using environment variables
 * @returns {object} Nodemailer transporter
 */
export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Sends a contact form submission notification email
 * @param {object} contactData - The contact form data
 * @returns {Promise} - Result of the email sending operation
 */
export async function sendContactNotification(contactData) {
  const { name, email, subject, message, recipient, isResponse } = contactData;

  const transporter = createTransporter();

  // Determine if this is a notification to admin or a response to user
  const to = isResponse ? recipient : process.env.EMAIL_TO;
  const from = process.env.EMAIL_FROM;
  const emailSubject = isResponse
    ? subject
    : `New Contact Form Submission: ${subject}`;

  let htmlContent, textContent;

  if (isResponse) {
    // Email response to user
    htmlContent = `
      <h2>Response from Philosiq</h2>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        ${message.replace(/\n/g, "<br>")}
      </div>
      <p style="color: #777; margin-top: 20px; font-size: 12px;">
        This is a response to your inquiry submitted through the Philosiq contact form.
      </p>
    `;

    textContent = `
      Response from Philosiq
      ---------------------------
      ${message}
      
      This is a response to your inquiry submitted through the Philosiq contact form.
    `;
  } else {
    // Notification to admin
    htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        ${message.replace(/\n/g, "<br>")}
      </div>
      <p style="color: #777; margin-top: 20px; font-size: 12px;">
        This email was sent from the Philosiq contact form.
      </p>
    `;

    textContent = `
      New Contact Form Submission
      ---------------------------
      From: ${name} (${email})
      Subject: ${subject}
      
      Message:
      ${message}
      
      This email was sent from the Philosiq contact form.
    `;
  }

  const mailOptions = {
    from,
    to,
    subject: emailSubject,
    html: htmlContent,
    text: textContent,
    replyTo: isResponse ? from : email,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Email ${isResponse ? "response" : "notification"} sent:`,
      info.messageId
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(
      `Error sending ${isResponse ? "response" : "notification"} email:`,
      error
    );
    throw error;
  }
}
