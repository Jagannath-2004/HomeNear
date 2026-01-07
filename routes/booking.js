const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLogedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const bookingController = require("../controllers/booking");

router.post("/", isLogedIn, wrapAsync(bookingController.createBooking));

module.exports = router;