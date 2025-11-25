const express=require("express"); 
const router=express.Router();
const Listing=require("../model/listings.js");
const wrapAync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} =require("../schema.js");

const validateListing = (req, res, next) => {
  const { error } = listingSchema .validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

//show All Data
router.get("",wrapAync(async (req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/home.ejs",{allListings});
}));
//Add new
router.get("/new",(req,res)=>{
  res.render("listings/new.ejs");
});
//Show 1 listing
router.get("/:id",wrapAync(async (req,res)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id).populate("reviews");
  //if (!listing) throw new ExpressError(404, "Listing not found");
  if(!listing){
    req.flash("error","Error Ocuured :(");
    res.redirect("/listings")
  }
  res.render("listings/show.ejs",{listing});
}));
//Adding new
router.post("/new",async (req, res) => {
  let newListing = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    location: req.body.location,
    country: req.body.country,
    image: {
      url: req.body.image.url,
      filename: "custom-upload"
    }
  };
  let listing=await Listing.create(newListing);
  if (!listing) throw new ExpressError(404, "Listing not found");
  req.flash("success","New listing Added");
  res.redirect("/listings");
});

//edit
router.get("/edit/:id",wrapAync(async (req,res)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing not found");
  res.render("listings/edit.ejs",{listing});
}));

router.put("/edit/:id",wrapAync(async (req,res,next)=>{  
    let {id}=req.params;
  let newListing = { 
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    location: req.body.location,
    country: req.body.country,
    image: {
      url: req.body.url,
      filename: "custom-upload"
    }
  };
  let listing=await Listing.findByIdAndUpdate(id, newListing, { runValidators: true });
  if (!listing) throw new ExpressError(404, "Listing not found");
  console.log("Edited");
   req.flash("success","Edited Successfully");
  res.redirect("/listings");
}));

//Delete
router.delete("/:id",wrapAync(async (req,res)=>{
  const {id}=req.params;
  let listing=await Listing.findByIdAndDelete(id);
  if (!listing) throw new ExpressError(404, "Listing not found");
  console.log(listing);
   req.flash("success","Listing deleted Successfully...!");
  res.redirect("/listings");
}));


module.exports=router;