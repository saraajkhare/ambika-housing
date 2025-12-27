const Enquiry = require("../models/Enquiry.model");
const nodemailer = require("nodemailer");

exports.createEnquiry = async (req, res) => {
  try {
    const { name, phone, email, property } = req.body;

    // ✅ Save to MongoDB
    await Enquiry.create({
      name,
      phone,
      email,
      property,
    });

    // ✅ Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: "New Property Enquiry",
      html: `
        <h3>New Enquiry</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Property:</b> ${property}</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry saved & email sent",
    });
  } catch (error) {
    console.error("❌ Enquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
