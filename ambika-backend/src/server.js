const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const enquiryRoutes = require("./routes/enquiry.routes");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// test
app.get("/", (req, res) => {
  res.send("Ambika Backend is running 🚀");
});

app.use("/api/enquiry", enquiryRoutes);

// ✅ CHAT ROUTE
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    console.log("KEY:", process.env.CLAUDE_API_KEY); // debug

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
        messages: [
          ...(history || []),
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    console.log("Claude:", data);

    const reply = data?.content?.[0]?.text || "Sorry, try again.";

    res.json({ reply });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ reply: "Server error" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});