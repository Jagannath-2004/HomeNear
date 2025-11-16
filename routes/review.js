const express = require("express");
const router=express.Router({mergeParams:true});
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressErrors= require("../utils/ExpressErrors");
const {listingSchema, reviewSchema}=require("../SchemaValidation");
const{isLogedIn, isOwner,validateReviews, isAuthorOfReview}=require("../middleware");
const reviewController = require("../controllers/reviewContrillers");


//Reviews Post Route
router.post("/",isLogedIn, validateReviews, wrapAsync(reviewController.postReviews));

//Reviews Delete Route
router.delete("/:reviewId",isLogedIn,isAuthorOfReview, wrapAsync(reviewController.deleteReviews));

module.exports=router;