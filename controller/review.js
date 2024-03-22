const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.postReview=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let new_review=new Review(req.body.review);
    new_review.author=req.user._id;
    listing.reviews.push(new_review);
    await new_review.save();
    await listing.save();
    req.flash("success","Review successfully added");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("success","Review successfully deleted");
    res.redirect(`/listings/${id}`);
}