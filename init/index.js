const mongoose = require("mongoose");
const data = require("./data");
const Listing = require("../models/listing.js");
main().then(()=>{
    console.log("Connected to db");
}).catch(err=>{
    console.log(err);
}); 

async function main(){
    await mongoose.connect('mongodb://localhost:27017/homenear');
}

const initDB= async()=>{
    await Listing.deleteMany({});
    data.data= data.data.map((obj)=>({...obj, owner:"691403bdbf820eec5304c0ea"}));
    await Listing.insertMany(data.data);
    console.log("data initialized");
}
initDB();