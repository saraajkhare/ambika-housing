const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const enquiryRoutes = require("./routes/enquiry.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Fail fast if DB down
    socketTimeoutMS: 15000,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ Critical MongoDB error: Failed to connect! Queries will fail.");
    console.error(err.message);
  });

// test
app.get("/", (req, res) => {
  res.send("Ambika Backend is running 🚀");
});

app.use("/api/enquiry", enquiryRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
