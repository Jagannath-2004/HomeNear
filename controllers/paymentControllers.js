// const { instance } = require("../utils/razorpay");
// const Booking = require("../models/booking");

// module.exports.renderPayment = async (req, res) => {
//     const booking = await Booking.findById(req.params.bookingId).populate("listing");

//     const order = await instance.orders.create({
//         amount: booking.totalPrice * 100,
//         currency: "INR"
//     });

//     res.render("payments/checkout", {
//         booking,
//         order,
//         razorpayKey: process.env.RAZORPAY_KEY_ID
//     });
// };

const crypto = require("crypto");
const Booking = require("../models/booking");

module.exports.verifyPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bookingId
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        await Booking.findByIdAndDelete(bookingId);
        return res.status(400).json({ success: false });
    }

    const booking = await Booking.findById(bookingId);
    booking.paymentStatus = "paid";
    booking.razorpayPaymentId = razorpay_payment_id;
    await booking.save();

    res.json({ success: true });
};