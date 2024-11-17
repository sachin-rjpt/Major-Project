const passport = require("passport");
const express=require("express");
const router=express.Router();
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../Controllers/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
// new user
router
.route("/signup")
.get(wrapAsync(userController.renderSignUpForm))
.post(wrapAsync(userController.createUser));

// login
router.route("/login")
.get(wrapAsync(userController.renderLoginForm))
.post(saveRedirectUrl,passport.authenticate('local',{failureRedirect:"/login",failureFlash:true}),wrapAsync(userController.login));
// logout
router.get("/logout",wrapAsync(userController.logout));

module.exports=router;