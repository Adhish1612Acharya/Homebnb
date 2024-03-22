const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReviews,isLoggedIn,isAuthor}=require("../middlewares.js");
const reviewController=require("../controller/review.js");

//reviews route
router.post("/",isLoggedIn,validateReviews,wrapAsync(reviewController.postReview)); 

//delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;