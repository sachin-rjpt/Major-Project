const mongoose =require("mongoose");
const Review=require("./review.js");
const listingSchema=new mongoose.Schema({
       title: {
         type :String,
         required:true
       },
       description:String,
       image:{
            url:String,
            filename:String
       },
       price:Number,
       location:String,
       country:String,
       reviews :[
        {
          type :mongoose.Schema.Types.ObjectId,
          ref:'Review'
        }
       ],
       owner :{
         type :mongoose.Schema.Types.ObjectId,
         ref:"User"
       },
       category :{
         type:String,
         enum :["Hostal","Individual"]
       },
       room :{
           type :String,
           enum :["Single Room","1 BHK","2 BHK","3 BHK"]
       },
       city :{
        type:String,
        enum :["Indore","Bhopal"]
       } 
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
     await Review.deleteMany({_id : {$in :listing.reviews}});
    }
})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;