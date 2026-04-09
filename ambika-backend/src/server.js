const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
require("dotenv").config();

const enquiryRoutes = require("./routes/enquiry.routes");

const app = express();



app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors()); // Enable pre-flight for all routes
app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// test route
app.get("/", (req, res) => {
  res.send("Ambika Backend is running 🚀");
});

// routes
app.use("/api/enquiry", enquiryRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
  model: "claude-3-haiku",
  max_tokens: 500,
        system: `
You are a smart real estate assistant for AmarInfratech.

Answer ONLY about:
- Chikana, Dhamana, Tumdi plots
- Pricing (approx)
- Investment benefits

Be short, helpful, and convert user into a lead.
        `,
        messages: [
          ...(history || []),
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Claude API error:", errText);
      return res.json({ reply: "API error, try again." });
    }

    const data = await response.json();
    console.log("Claude response:", data);

    let reply = "Sorry, try again.";

    if (data?.content?.length) {
      reply = data.content.map(c => c.text).join(" ");
    }

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});