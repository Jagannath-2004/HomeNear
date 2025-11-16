const express = require("express");
const router=express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressErrors= require("../utils/ExpressErrors");
const {listingSchema, reviewSchema}=require("../SchemaValidation");
const{isLogedIn, isOwner,validateListing}=require("../middleware");

const listingController = require("../controllers/listingControllers");

const multer  = require('multer');
const {cloudinary, storage}= require("../cloudinaryConfig");
const upload = multer({ storage });


router.route("/")
    //Index Route
    .get(wrapAsync(listingController.index))
    //New Route to save
    .post(isLogedIn,upload.single('image'), validateListing, wrapAsync(listingController.saveListing));

//search
router.get("/search", wrapAsync(listingController.searchListings));

//New Route to form
router.get("/new", isLogedIn, listingController.renderNewForm);

//Filter results
router.get("/category/:category", wrapAsync(listingController.categoryListings));

router.route("/:id")
    //Update 
    .put(isLogedIn, isOwner, upload.single('image'), validateListing, wrapAsync(listingController.updateListing))
    //Delete Route
    .delete(isLogedIn, isOwner, wrapAsync(listingController.deleteListing))
    //Show Route
    .get(wrapAsync(listingController.showListing));

//Update form
router.get("/:id/edit",isLogedIn, isOwner, wrapAsync(listingController.newUpdateForm));


module.exports=router;