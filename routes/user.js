const express = require("express");
const router=express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const ExpressErrors= require("../utils/ExpressErrors");
const {listingSchema, reviewSchema}=require("../SchemaValidation");
const passport =require("passport");
const{saveRedirectUrl}=require("../middleware");
const userController = require("../controllers/userControllers");

router.route("/signup")
    //Render Signup form
    .get(userController.renderSignupForm)
    //Signup Post route
    .post(wrapAsync(userController.signup));


router.route("/login")
    //Render Login form
    .get(userController.renderLoginForm)
    //Login Post Route
    .post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}),
    userController.login);

router.get("/logout",userController.logout);

module.exports= router;