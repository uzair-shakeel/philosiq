import { createTransporter } from "../../../utils/email";
import { jsPDF } from "jspdf";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, pdfData, archetypeName } = req.body;

    if (!email || !pdfData) {
      return res.status(400).json({
        success: false,
        message: "Email and PDF data are required",
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your PhilosiQ Political Archetype Results",
      html: `
        <h2>Your PhilosiQ Results</h2>
        <p>Thank you for taking the PhilosiQ political archetype quiz!</p>
        <p>Your archetype is: <strong>${archetypeName || "Unknown"}</strong></p>
        <p>Please find your detailed results attached as a PDF.</p>
        <p>Visit <a href="https://philosiq.com">philosiq.com</a> to learn more about your political archetype.</p>
      `,
      text: `
        Your PhilosiQ Results
        
        Thank you for taking the PhilosiQ political archetype quiz!
        Your archetype is: ${archetypeName || "Unknown"}
        
        Please find your detailed results attached as a PDF.
        
        Visit philosiq.com to learn more about your political archetype.
      `,
      attachments: [
        {
          filename: `PhilosiQ-${
            archetypeName?.replace(/\s+/g, "-") || "Results"
          }.pdf`,
          content: pdfData,
          encoding: "base64",
          contentType: "application/pdf",
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Results sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending results email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send results email",
      error: error.message,
    });
  }
}
