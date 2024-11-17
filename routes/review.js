const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateAuthor,isLoggedIn}=require("../middleware.js");
const reviewController=require("../Controllers/review.js");
// review adding route 
router.post("/",isLoggedIn,wrapAsync(reviewController.createReview));
// review delete 
router.delete("/:reviewId",isLoggedIn,validateAuthor,wrapAsync(reviewController.destroyReview));
module.exports=router;