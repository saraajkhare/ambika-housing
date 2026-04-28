const Enquiry = require("../models/Enquiry.model");
const nodemailer = require("nodemailer");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "amarinfra@admin";
const ADMIN_TOKEN = "amarinfra-secret-token-8f9d2";

exports.adminLogin = async (req, res) => {
  try {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      return res.status(200).json({ success: true, token: ADMIN_TOKEN });
    } else {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getEnquiries = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching leads" });
  }
};

exports.createEnquiry = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { name, phone, email, property } = req.body;

    // ✅ Basic validation
    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ Save to MongoDB
    const newEnquiry = await Enquiry.create({
      name,
      phone,
      email,
      property,
    });

    console.log("Saved to DB ✅");

    // ✅ EMAIL (SAFE - won't crash app)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          connectionTimeout: 5000, // Timeout to prevent infinite freeze
          greetingTimeout: 5000,
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

        console.log("Email sent ✅");
      } else {
        console.log("⚠️ Email env variables missing, skipping email");
      }
    } catch (emailError) {
      console.error("❌ Email failed:", emailError);
      // ❗ Don't crash if email fails
    }

    res.status(201).json({
      success: true,
      message: "Enquiry saved successfully",
    });

  } catch (error) {
    console.error("❌ Enquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};