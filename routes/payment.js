const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const paymentController = require("../controllers/paymentControllers");

router.post("/verify", wrapAsync(paymentController.verifyPayment));

module.exports = router;