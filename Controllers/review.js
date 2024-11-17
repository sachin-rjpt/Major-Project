const expressError=require("../utils/expressError");
const Review=require("../models/review.js");
const {reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
// create review
module.exports.createReview=async(req,res)=>{
    let {id}=req.params;
    console.log(req.body);
    let {error}=reviewSchema.validate(req.body);
    if(error){
       throw new expressError(400,error);
    }
    let review=  new Review(req.body.review);
    review.author=res.locals.currUser._id;
    let listing= await Listing.findById(id);
    let result=await review.save();
     listing.reviews.push(result);
    await listing.save();
    req.flash("success","review added successfully!");
    res.redirect(`/Listings/${id}`);

};
// delete review ;
module.exports.destroyReview=async (req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    req.flash("success","review deleted successfully!");
    res.redirect(`/Listings/${id}`);
 }