const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const enquiryRoutes = require("./routes/enquiry.routes");

const app = express();

const cors = require("cors");

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
