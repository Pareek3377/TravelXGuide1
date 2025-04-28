import GuideApplication from "../models/guideApplicationModel.js";
import nodemailer from "nodemailer";

export const applyGuide = async (req, res) => {
  try {
    const { name, email, phone, experience } = req.body;

    if (!name || !email || !phone || !experience) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newApplication = new GuideApplication({
      name,
      email,
      phone,
      experience,
    });

    await newApplication.save();

    // Send email to Admin
    await sendEmailToAdmin(newApplication);

    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Error in guide application:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Send Email to Admin
const sendEmailToAdmin = async (application) => {
  try {
    // Setup Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL, // ✅ your gmail
        pass: process.env.ADMIN_PASSWORD, // ✅ your app password (not normal password)
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL, // sending to yourself (admin)
      subject: "New Guide Application Received",
      html: `
        <h2>New Guide Application</h2>
        <p><strong>Name:</strong> ${application.name}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        <p><strong>Phone:</strong> ${application.phone}</p>
        <p><strong>Experience:</strong> ${application.experience}</p>
        <p>Login to Admin Panel to Approve or Reject this application.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to Admin!");
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};
