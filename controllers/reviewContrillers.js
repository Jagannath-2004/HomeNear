const Listing= require("../models/listing");
const Review = require("../models/review");

module.exports.postReviews=async(req,res, next)=>{
    let{id}= req.params;
    let listing= await Listing.findById(id);
    let{comment, rating }=req.body;
    let newReview = new Review({
        comment,rating
    });
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Added");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReviews=async(req,res,next)=>{
    let{id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}