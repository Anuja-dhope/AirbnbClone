const Review=require("../model/review");
const Listing=require("../model/listings");
const ExpressError=require("../utils/ExpressError.js");

module.exports.addReview=async (req,res)=>{
  let id=req.params.id;
  let newReview=new Review(req.body.review);
  newReview.author=req.user._id;
  let listing=await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing not found");

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success","New Review Added");
  res.redirect(`/listings/${listing._id}`);
};

//delete Review
module.exports.delete=(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review Deleted");
  res.redirect(`/listings/${id}`);
});