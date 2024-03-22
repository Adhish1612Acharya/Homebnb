const express=require("express");
const wrapAsync = require("../utils/wrapAsync");
const router=express.Router();
const passport=require("passport");
const {redirect}=require("../middlewares.js");
const userController=require("../controller/user.js");

router
.route("/signup")
.get(userController.signUpForm)
.post(wrapAsync(userController.signUp));

router
.route("/login")
.get(userController.loginForm)
.post(redirect,passport.authenticate("local",
{failureRedirect:"/login",
failureFlash:true}),userController.login);

router.get("/logout",userController.logout);

module.exports=router;