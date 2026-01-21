// const Listing=require("../model/listings");

// //Show All Listings
// module.exports.index=async (req,res)=>{
//     let allListings=await Listing.find({});
//     res.render("listings/home.ejs",{allListings});
// };

// //render add new listing form
// module.exports.addNew=(req,res)=>{
//   res.render("listings/new.ejs");
// };


// //view individual listing
// module.exports.viewIndividual=async (req, res) => {
//   let { id } = req.params;
//   let listing = await Listing.findById(id)
//   .populate({
//     path:"reviews",
//     populate:{
//       path:"author"
//   }}).populate("owner");

//   if (!listing) {
//     req.flash("error", "Error Occurred :(");
//     return res.redirect("/listings");
//   }

//   const currUser = req.user; // Passport sets this when logged in

//   // Ownership check
//   const isOwner = currUser && listing.owner && (
//     Array.isArray(listing.owner)
//       ? listing.owner.some(o => currUser._id.equals(o._id))
//       : currUser._id.equals(listing.owner._id)
//   );

//   res.render("listings/show.ejs", { listing, currUser, isOwner });
// };

// //Create new Listing
// module.exports.createNew=async (req, res) => {
//   let newListing = {
//     title: req.body.title,
//     description: req.body.description,
//     price: req.body.price,
//     location: req.body.location,
//     country: req.body.country,
//     image: {
//       url: req.body.url,
//       //filename: "custom-upload"
//     },
//     owner: [req.user._id] 
//   };
//   let listing=await Listing.create(newListing);
//   if (!listing) throw new ExpressError(404, "Listing not found");
//   req.flash("success","New listing Added");
//   res.redirect("/listings");
// };


// //Edit Listing
// module.exports.editForm=async (req,res)=>{
//   let {id}=req.params;
//   let listing=await Listing.findById(id);
//   if (!listing) throw new ExpressError(404, "Listing not found");
//   res.render("listings/edit.ejs",{listing});
// };

// module.exports.edit=async (req,res,next)=>{  
//     let {id}=req.params;
//   let newListing = { 
//     title: req.body.title,
//     description: req.body.description,
//     price: req.body.price,
//     location: req.body.location,
//     country: req.body.country,
//     image: {
//       url: req.body.url,
//       //filename: "custom-upload"
//     }
//   };
//   let listing=await Listing.findByIdAndUpdate(id, newListing, { runValidators: true });
//   if (!listing) throw new ExpressError(404, "Listing not found");
//   console.log("Edited");
//    req.flash("success","Edited Successfully");
//   res.redirect("/listings");
// };

// //delete
// module.exports.delete=async (req,res)=>{
//   const {id}=req.params;
//   let listing=await Listing.findByIdAndDelete(id);
//   if (!listing) throw new ExpressError(404, "Listing not found");
//   console.log(listing);
//    req.flash("success","Listing deleted Successfully...!");
//   res.redirect("/listings");
// };

const Listing = require("../model/listings");

// SHOW ALL
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/home.ejs", { allListings });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// CREATE
module.exports.createListing = async (req, res) => {
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;

  await listing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// SHOW ONE
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const isOwner =
    req.user && listing.owner && req.user._id.equals(listing.owner._id);

  res.render("listings/show.ejs", { listing, isOwner });
};

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  console.log(req.body)
  const { id } = req.params;
  console.log(id)
  await Listing.findByIdAndUpdate(id, req.body.listing, {
    runValidators: true,
  });

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
