const Enquiry = require("../models/Enquiry.model");
const nodemailer = require("nodemailer");

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