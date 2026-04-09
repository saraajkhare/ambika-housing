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

