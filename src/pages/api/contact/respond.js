import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectToDatabase from "../../../lib/mongodb";
import Contact from "../../../models/Contact";
import { sendContactNotification } from "../../../utils/email";

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  // Check admin authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    // Connect to the database
    await connectToDatabase();

    const { contactId, response } = req.body;

    // Validate required fields
    if (!contactId || !response) {
      return res.status(400).json({
        success: false,
        message: "Contact ID and response are required",
      });
    }

    // Find the contact message
    const contactMessage = await Contact.findById(contactId);
    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    // Update the contact message with the response
    contactMessage.response = response;
    contactMessage.status = "responded";
    contactMessage.respondedAt = new Date();
    contactMessage.respondedBy = session.user.id;

    await contactMessage.save();

    // Send email response to the user
    try {
      // Create a transporter and send the email
      await sendContactNotification({
        name: "PhilosiQ Admin",
        email: "info@philosiq.com",
        subject: `Re: ${contactMessage.subject}`,
        message: `
Dear ${contactMessage.name},

Thank you for contacting us. Here is our response to your inquiry:

${response}

Your original message:
"${contactMessage.message}"

Best regards,
The PhilosiQ Team
        `,
        recipient: contactMessage.email,
        isResponse: true,
      });
    } catch (emailError) {
      console.error("Failed to send response email:", emailError);
      // Continue with the request even if email fails
    }

    return res.status(200).json({
      success: true,
      message: "Response sent successfully",
    });
  } catch (error) {
    console.error("Error responding to contact message:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send response",
    });
  }
}
