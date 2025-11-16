const User = require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup");
};

module.exports.signup=async(req,res,next)=>{
    try{
        let {username, email, password}= req.body;
        let newUser = new User({
            username,
            email
        });
        let regUser =await User.register(newUser,password);
        req.login(regUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to HomeNear!");
            res.redirect("/listings");
        })
        
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login");
};

module.exports.login=async(req,res)=>{
        req.flash("success","Welcome back to HomeNear! You are logged in");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You loged out successfully");
        res.redirect("/listings");
    })
}