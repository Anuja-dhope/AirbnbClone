const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../model/user.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");

//signup Form
router
    .route("/signup")
    .get(userController.signUpForm)
    .post(userController.signUp);

//Login
router
    .route("/login")
    .get(userController.loginForm)
    .post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login',failureFlash:true, }),userController.login);

//logout
router.get("/logout",userController.logOut);

module.exports=router;