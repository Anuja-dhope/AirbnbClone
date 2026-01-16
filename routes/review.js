const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} =require("../schema.js");
const Review=require("../model/review.js"); 
const Listing=require("../model/listings.js");
const {isLoggedIn}=require("../middleware.js");
const reviewController=require("../controllers/review.js");

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
router.post("",isLoggedIn,wrapAync(reviewController.addReview));

//delete review
router.delete("/:reviewId",reviewController.delete);


module.exports=router;