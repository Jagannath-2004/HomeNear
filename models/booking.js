const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    totalDays: Number,
    totalPrice: Number,
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports=Booking;