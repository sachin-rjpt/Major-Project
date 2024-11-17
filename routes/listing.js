const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing =require("../models/listing.js");
const {isLoggedIn,validateOwner}=require("../middleware.js");
const listingController=require("../Controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});
//listing schema Validation 
// function validateSchema(req){
//     console.log(req.body);
//    const {error}=listingSchema.validate(req.body);
//     if(error){
//         throw new expressError(400,error);
//     }
// }
// home route
router.get("/",wrapAsync(async(req,res)=>{
    let allListings= await Listing.find();
    res.render("./listings/index.ejs",{allListings}); 
}));

// new route
router.get("/new",isLoggedIn,wrapAsync(listingController.createform));
router.post("/",upload.single("listing[image]"),wrapAsync(listingController.new));

router.route("/:id")
.delete(isLoggedIn,validateOwner,wrapAsync(listingController.destroy))
.get(wrapAsync(listingController.index))
.put(isLoggedIn,validateOwner,upload.single("listing[image]"),wrapAsync(listingController.edit));
// edit route 
router.get("/:id/edit",isLoggedIn,validateOwner,wrapAsync(listingController.editform));


module.exports=router;