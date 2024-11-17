const User=require("../models/user");
//new user
module.exports.renderSignUpForm=async(req,res)=>{
    res.render("./user/signup.ejs");
}
module.exports.createUser=async (req,res)=>{
    try{
    let {username,email,password}=req.body;
   let newUser=new User({
    username:username,
    email : email
   });
   await User.register(newUser,password);
   req.login(newUser,(err)=>{
       if(err){
           next(err);
       }
       req.flash("success","user registered successfully!");
       res.redirect("/Listings");
   });
} catch(err){
    req.flash("error",`${err.message}`);
    res.redirect("/signup");
}
};
// login 
module.exports.renderLoginForm=(req,res)=>{
    res.render("./user/login.ejs");
}
module.exports.login=async(req,res)=>{
    req.flash("success","welcome again!,now you are login");
   res.redirect(res.locals.redirectUrl);
};
// logout 
module.exports.logout=async(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you have logged out successfully!");
        res.redirect("/Listings");
    })
}