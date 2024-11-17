const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const data=require("./data.js");
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
 }
 main()
 .then(()=>{
     console.log("db is connected");
 })
 .catch((err)=>{
     console.log(err);
 });
 const initDB=async()=>{
    await Listing.deleteMany({});
   data.sampleListings=data.sampleListings.map((obj)=>({...obj,owner:'6735f39e1a8ceeaf7393410a'}));
    await Listing.insertMany(data.sampleListings)
    .then((res)=>{
        console.log(res);
    })
    .catch((err)=>{
        console.log(err);
    });
 };
 initDB();