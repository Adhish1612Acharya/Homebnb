const User=require("../models/user.js");

module.exports.signUpForm=(req,res)=>{
    res.render("./users/signUp.ejs");
};

module.exports.signUp=async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new User({
            username:username,
            email:email,
        });
        let registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
               return next(err);
            }
            req.flash("success","Welcome to WanderLust");
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm=(req,res)=>{
    res.render("./users/login.ejs")
};

module.exports.login=(req,res)=>{
    req.flash("success","welcome to Wanderlust");
    let redirect= res.locals.redirect || "/listings";/*to redirect to listings page 
                                                       itself after login if the user 
                                                        had pressed login button*/
      res.redirect(redirect); 
 };

 module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are successfully loggedOut");
        res.redirect("/listings");
    })
};