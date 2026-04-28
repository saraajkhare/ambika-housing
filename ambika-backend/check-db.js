const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Enquiry = require("./src/models/Enquiry.model");

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
}).then(async () => {
  console.log("Connected to MongoDB via scratch script.");
  const leads = await Enquiry.find({});
  console.log("Total leads in DB:", leads.length);
  if (leads.length > 0) {
    console.log("Sample lead:", leads[0]);
  } else {
    console.log("No leads exist in the database!");
  }
  process.exit(0);
}).catch(err => {
  console.error("MongoDB Connection Error:", err);
  process.exit(1);
});
