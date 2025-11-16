const Listing = require("./models/listing");
const ExpressErrors= require("./utils/ExpressErrors");
const {listingSchema, reviewSchema}=require("./SchemaValidation");
const Review = require("./models/review");

module.exports.isLogedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Login to create listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing = await Listing.findById(id);
    //Checking if current user and listing owner is same
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthorOfReview=async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review = await Review.findById(reviewId);
    //Checking if current user and Review owner is same
    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(er=>{er.message}).join(",");
        throw new ExpressErrors(400,error);
    }else{
        next();
    }
};

module.exports.validateReviews=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressErrors(400,error);
    }else{
        next();
    }
};