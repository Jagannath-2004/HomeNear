const Listing = require("../models/listing");
const axios = require("axios");
const {cloudinary}= require("../cloudinaryConfig");

module.exports.index=async (req,res,next)=>{
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new");
};
    
module.exports.saveListing=async (req,res,next)=>{
    // let result=listingSchema.validate(req.body);
    // if(result.error){
    //     throw new ExpressErrors(400,result.error);
    // }
    // console.log(result);

    try{
        let url=req.file?.path || null;
        let filename=req.file?.filename || null;
        let {title, description,category, price, location,country} = req.body;
        const geoResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: location,
                format: "json",
                limit: 1,
            },
            headers: {
                "User-Agent": "HomeNear-App"  // required by Nominatim
            }
            });

        if (geoResponse.data.length === 0) {
            req.flash("error", "Location not found. Please try a different address.");
            return res.redirect("/listings/new");
        }

        const lat = geoResponse.data[0].lat;
        const lon = geoResponse.data[0].lon;

        const newListing= new Listing({
        title,
        description,
        category,
        image: { url,filename},
        price,
        location,
        country,
        geometry: {
        type: "Point",
        coordinates: [lon,lat], // GeoJSON format [lng, lat]
            },
        });
        newListing.owner= req.user._id;
        await newListing.save();
        req.flash("success","New Listing Added");
        res.redirect("/listings/");
    }catch(err){
        next(err);
    }
    
}

module.exports.newUpdateForm=async (req,res,next)=>{
    let{id}= req.params;
    let listing = await Listing.findById(id);
    let originalImage= listing.image.url;
    originalImage=originalImage.replace("/upload","/upload/w_250")
    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit", {listing, originalImage});
}

module.exports.updateListing=async (req,res,next)=>{
    let{id}= req.params;
    // if(!req.body || !req.body.title){
    //     throw new ExpressErrors(400,"Send valid data for listing");
    // }
    let {title, description,category, price, location,country} = req.body;
    
    let geoData = null;

    if (location && location.trim() !== "") {
      const geoResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: location,
          format: "json",
          limit: 1
        },
        headers: {
          "User-Agent": "HomeNear-App"
        }
      });

      if (geoResponse.data.length === 0) {
        req.flash("error", "Location not found. Try another address.");
        return res.redirect(`/listings/${id}/edit`);
      }

      geoData = geoResponse.data[0]; // { lat, lon }
    }

    let listing=await Listing.findByIdAndUpdate(id,{title,description,category,price,location,country});
    if (geoData) {
      listing.geometry = {
        type: "Point",
        coordinates: [geoData.lon, geoData.lat]   // ALWAYS [lng, lat]
      };
      await listing.save();
    }
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    
    req.flash("success","Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async (req,res,next)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    // Delete image from Cloudinary
    if (listing.image && listing.image.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
    }

    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
}

module.exports.showListing=async (req,res,next)=>{
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id)
            .populate({path:"reviews", populate:{path:"author"}})
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing does not exist");
            return res.redirect("/listings");
        }

        res.render("listings/show", { listing });
    } catch (err) {
        // Check if the error is a Mongoose CastError
        if (err.name === "CastError") {
            req.flash("error", "Invalid listing ID");
            return res.redirect("/listings");
        }
        next(err); // pass any other error to Express error handler
    }
}

module.exports.categoryListings=async(req,res, next)=>{
    let{category}=req.params;
    const listings =await Listing.find({category});
    if(listings.length===0){
        req.flash("info", "No listing exist under this category.");
        return res.redirect("/listings");
    }
    res.render("listings/index",{allListings: listings, selectedCategory: category})
};


//Search
module.exports.searchListings = async (req, res) => {
    const query = req.query.q?.trim();

    if (!query) {
        req.flash("error", "Please enter something to search.");
        return res.redirect("/listings");
    }

    // Case-insensitive search
    const regex = new RegExp(query, "i");

    const listings = await Listing.find({
        $or: [
            { title: regex },
            { country: regex },
            { location: regex },
            { category: regex }
        ]
    });

    if (listings.length === 0) {
        req.flash("error", "No results found.");
        return res.redirect("/listings");
    }

    res.render("listings/index", {
        allListings: listings,
        selectedCategory: null,
        searchQuery: query
    });
};


// module.exports.categoryListings = async (req, res, next) => {
//     let { category } = req.params;
//     const listings = await Listing.find({ category });

//     console.log("CATEGORY =", category);
//     console.log("RESULT =", listings);
//     console.log("LENGTH =", listings.length);

//     if (listings.length === 0) {
//         console.log("No Listing FOUND!!");
//     }

//     res.render("listings/index", { allListings: listings, selectedCategory: category });
// };