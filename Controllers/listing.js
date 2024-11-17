const Listing=require("../models/listing.js");
const expressError=require("../utils/expressError");
// index route
module.exports.index=async(req,res)=>{
    let {id}=req.params;
     const data=await Listing.findById(id).populate({
        path: "reviews",
        populate :{
            path:"author",
        }
     }).populate("owner");
     if(!data){
        req.flash("error","listing does not exist");
        res.redirect("/Listings");
     }
    res.render("./listings/show.ejs",{data});
};
// create form 
module.exports.createform=(req,res)=>{
   res.render("./Listings/new.ejs");
};
// new route
module.exports.new=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    req.body.listing.owner=req.user._id;
    let newlisting=new Listing(req.body.listing);
    newlisting.image={url,filename};
     await newlisting.save();
     req.flash("success","new Listing is Created !");
      res.redirect("/Listings");
};

// delete route
module.exports.destroy=async(req,res)=>{
   let {id}=req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success","Listing deleted Successfully!");
    res.redirect("/Listings");
};
// edit form 
module.exports.editform=async(req,res)=>{
   let {id}=req.params;
   let listing=await Listing.findById(id);
   if(!listing){
      req.flash("error","listing does not exist");
      res.redirect("/Listings");
   }
   let OriginalImageUrl=listing.image.url;
    OriginalImageUrl=OriginalImageUrl.replace("&w=800","&w=250");
    console.log(OriginalImageUrl);
   res.render("./listings/edit.ejs",{listing,OriginalImageUrl});
};
// edit  route 
module.exports.edit=async(req,res)=>{
    let {id}=req.params;
   let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file!=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
   }
req.flash("success","listing edited successfully!")
  res.redirect("/Listings");
};