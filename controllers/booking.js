// const Booking = require("../models/booking");
// const Listing = require("../models/listing");
// const { instance } = require("../utils/razorpay");

// module.exports.createBooking = async (req, res) => {
//     const { id } = req.params;
//     const { fromDate, toDate } = req.body;

//     const start = new Date(fromDate);
//     const end = new Date(toDate);

//     if (start >= end) {
//         req.flash("error", "Invalid date range");
//         return res.redirect(`/listings/${id}`);
//     }

//     // Check overlapping bookings
//     const conflict = await Booking.findOne({
//         listing: id,
//         $or: [
//             { fromDate: { $lt: end }, toDate: { $gt: start } }
//         ]
//     });

//     if (conflict) {
//         req.flash("error", "Listing not available for selected dates");
//         return res.redirect(`/listings/${id}`);
//     }

//     const listing = await Listing.findById(id);
//     const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
//     const totalPrice = totalDays * listing.price;

//     const booking = await Booking.create({
//         listing: id,
//         user: req.user._id,
//         fromDate: start,
//         toDate: end,
//         totalDays,
//         totalPrice
//     });

//     const order = await instance.orders.create({
//         amount: totalPrice * 100,
//         currency: "INR",
//         receipt: booking._id.toString()
//     });

    

//     booking.razorpayOrderId = order.id;
//     await booking.save();

//     res.json({
//         bookingId: booking._id,
//         orderId: order.id,
//         amount: order.amount,
//         key: process.env.RAZORPAY_KEY_ID
//     });

    // // Save booking (payment pending)
    // const booking = new Booking({
    //     listing: id,
    //     user: req.user._id,
    //     fromDate: start,
    //     toDate: end,
    //     totalDays,
    //     totalPrice
    // });

    // await booking.save();

    // // Redirect to payment
    // res.redirect(`/payment/${booking._id}`);
    // res.render("payments/checkout", {
    //     booking,
    //     order,
    //     razorpayKey: process.env.RAZORPAY_KEY_ID
    // });
// };
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { instance } = require("../utils/razorpay");

module.exports.createBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { fromDate, toDate } = req.body;

        if (!fromDate || !toDate) {
            return res.status(400).json({ error: "Dates are required" });
        }

        const start = new Date(fromDate);
        const end = new Date(toDate);

        if (start >= end) {
            return res.status(400).json({ error: "Invalid date range" });
        }

        // Check overlapping PAID bookings only
        const conflict = await Booking.findOne({
            listing: id,
            paymentStatus: "paid",
            fromDate: { $lt: end },
            toDate: { $gt: start }
        });

        if (conflict) {
            return res.status(400).json({
                error: "Listing not available for selected dates"
            });
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalPrice = totalDays * listing.price;

        const booking = await Booking.create({
            listing: id,
            user: req.user._id,
            fromDate: start,
            toDate: end,
            totalDays,
            totalPrice
        });

        const order = await instance.orders.create({
            amount: totalPrice * 100,
            currency: "INR",
            receipt: booking._id.toString()
        });

        booking.razorpayOrderId = order.id;
        await booking.save();

        // ✅ ALWAYS JSON RESPONSE
        res.json({
            bookingId: booking._id,
            orderId: order.id,
            amount: order.amount,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
