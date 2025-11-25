const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} =require("../schema.js");
const Review=require("../model/review.js"); 
const Listing=require("../model/listings.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema .validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};


//add review
router.post("",wrapAync(async (req,res)=>{
   console.log("hi.");
  let id=req.params.id;
  let newReview=new Review(req.body.review);
  let listing=await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing not found");

  listing.reviews.push(newReview);
  await newReview.save();
  //console.log("hi.");
  await listing.save();
   req.flash("success","New Review Added");
 // console.log("hi");
  res.redirect(`/listings/${listing._id}`);
//console.log("hi..");
}));

//delete review
router.delete("/:reviewId",(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review Deleted");
  res.redirect(`/listings/${id}`);
}));


module.exports=router;