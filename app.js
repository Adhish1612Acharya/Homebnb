if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const expressError=require("./utils/expressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const port=8080;

db_URL=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("DB successfully connected");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(db_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname,"public")));

app.engine("ejs",ejsMate);

const store = MongoStore.create({
    mongoUrl: db_URL,
    crypto: {
      secret: "mysecretcode",
    },
    touchAfter: 24*3600,
  });

store.on("error",(err)=>{
    console.log("Error occured in mongo session store",err);
});

const sessionOptions={
    store, //store:store,
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
    store:store,
}

app.get("/",(req,res)=>{
    res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

//passport configurations
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // To save the user in the browser
passport.deserializeUser(User.deserializeUser()); // To unsave the user in the browser


app.use((req,res,next)=>{
   res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
   res.locals.currUser=req.user;
   next();
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/review",reviewsRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode,message}=err;
    res.render("error.ejs",{err});
});

app.listen(port,(req,res)=>{
    console.log("App is listening on port 8080");
});

