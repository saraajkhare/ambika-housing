const express = require("express");
const router = express.Router();
const { createEnquiry, adminLogin, getEnquiries } = require("../controllers/enquiry.controller");

router.post("/", createEnquiry);
router.post("/login", adminLogin);
router.get("/", getEnquiries);

module.exports = router;
