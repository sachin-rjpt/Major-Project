if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const  ejsMate=require("ejs-mate");
const expressError=require("./utils/expressError");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const User=require("./models/user.js");
const LocalStrategy=require("passport-local");
const userRouter=require("./routes/user.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const mongoAtlas=process.env.DB_API;
app.engine("ejs",ejsMate);
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

 const store=MongoStore.create({
    mongoUrl :mongoAtlas,
    crypto :{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
 });
 store.on("error",()=>{
    console.log("error in monogo session store",err);
 })
const sessionInfo={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized :true,
    cookie : {
         expires:Date.now()+7*24*60*60*1000,
         maxAge:7*24*60*60*1000,
         httpOnly:true
    }
}

// session
app.use(session(sessionInfo));
app.use(flash());

//Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// serialize&De.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function main(){
   await mongoose.connect(mongoAtlas);
}
main()
.then(()=>{
    console.log("db is connected");
})
.catch((err)=>{
    throw err;
});
// using res.locals
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
// listing routs
app.use("/Listings",listingRouter);
// review routs
app.use("/Listings/:id/review",reviewRouter);
// user paths
app.use("/",userRouter);
// page not found 
app.use("*",(req,res,next)=>{
    next(new expressError(403,"page not found"));
});
// middleware
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"}=err;
    res.status(status).render("./listings/error.ejs",{message});
});
app.listen(8080,(req,res)=>{
    console.log("server is online ...");
});
