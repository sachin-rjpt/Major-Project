const Listing =require("./models/listing.js");
const Review=require("./models/review.js");
const isLoggedIn=(req,res,next)=>{
   // console.log(req.path+" ,"+req.originalUrl);
    if(!req.isAuthenticated()){
       req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to use this feature");
        res.redirect("/login");
    }
    next();
}
const saveRedirectUrl=(req,res,next)=>{
   if(req.session.redirectUrl){
  res.locals.redirectUrl=req.session.redirectUrl;
   }
  else {
    res.locals.redirectUrl="/Listings";
  } 
  next();
}
const validateOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing =await Listing.findById(id);
   if(!(res.locals.currUser&&res.locals.currUser._id.equals(listing.owner))){
      req.flash("error","access is denied!");
      return res.redirect(`/Listings/${id}`);
   }
   next();
}
const validateAuthor=async(req,res,next)=>{
      let {id,reviewId}=req.params;
      let review=await Review.findById(reviewId);
      if(!review.author.equals(res.locals.currUser.id)){
          req.flash("error","you are not author of this review");
         return res.redirect(`/Listings/${id}`);
      }
      next();
}
module.exports={isLoggedIn,saveRedirectUrl,validateOwner,validateAuthor};
