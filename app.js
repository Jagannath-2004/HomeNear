if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
// const Listing = require("./models/listing");
// const Review = require("./models/review");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync");
const ExpressErrors= require("./utils/ExpressErrors");
// const {listingSchema, reviewSchema}=require("./SchemaValidation");
const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const usersRouter = require("./routes/user");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const { error } = require("console");
const dbUrl= process.env.ATLASDB_URL;
const secret =process.env.SECRET;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);

main().then(()=>{
    console.log("Connected to db");
}).catch(err=>{
    console.log(err);
}); 

async function main(){
    await mongoose.connect(dbUrl);
}

const store= MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOptions={
    store,
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/",(req,res)=>{
    res.send("Server is running");
});

app.use((req,res,next)=>{
    // req.session.redirectUrl=req.originalUrl;
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.info=req.flash("info");
    res.locals.currentUser= req.user;
    next();
})

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/", usersRouter);

// app.get("/testlisting",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"New Listing",
//         description:"Near beach",
//         price:1500,
//         location:"Digha, WB",
//         country:"India"
//     })
//     await  sampleListing.save();
//     res.send("Saved")
// });

// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email:"abcd@gmail.com",
//         username:"abcd2004",
//     })
//     let registerUser =await User.register(fakeUser,"abcd@1234");
//     res.send(registerUser);
// })

app.use((req,res,next)=>{
    next(new ExpressErrors(404,"Page not Found"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500, message="Something went wrong"}=err;
    res.status(statusCode);
    res.render("layouts/errors",{err});
})
app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
});