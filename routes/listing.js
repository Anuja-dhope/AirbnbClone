

// const express = require("express");
// const router = express.Router();
// const Listing = require("../model/listings.js");
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema } = require("../schema.js");
// const { isLoggedIn } = require("../middleware.js");
// const listingController = require("../controllers/listings.js");

// // Validation middleware
// const validateListing = (req, res, next) => {
//   const { error } = listingSchema.validate(req.body);
//   if (error) {
//     const msg = error.details.map(el => el.message).join(", ");
//     throw new ExpressError(400, msg);
//   } else {
//     next();
//   }
// };

// // Show all listings
// router.route("/")
//   .get(wrapAsync(listingController.index));

// // Add new form + create new listing
// router.route("/new")
//   .get(isLoggedIn, listingController.addNew)
//   .post(isLoggedIn, validateListing, wrapAsync(listingController.createNew));

// // Individual listing
// router.route("/:id")
//   .get(wrapAsync(listingController.viewIndividual))
//   .delete(isLoggedIn, wrapAsync(listingController.delete));

// // Edit listing
// router.route("/edit/:id")
//   .get(isLoggedIn, wrapAsync(listingController.editForm))
//   .put(isLoggedIn, validateListing, wrapAsync(listingController.edit));

// module.exports = router;


const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// ------------------ VALIDATION ------------------
// const validateListing = (req, res, next) => {
//   const { error } = listingSchema.validate(req.body);
//   console.log(error)
//   if (error) {
//     const msg = error.details.map(el => el.message).join(",");
//     throw new ExpressError(400, msg);
//   }
//   next();
// };
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body); // validate top-level
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};

// ------------------ ROUTES ------------------
router
  .route("/")
  .get(wrapAsync(listingController.index));

router
  .route("/new")
  .get(isLoggedIn, listingController.renderNewForm)
  .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .delete(isLoggedIn, wrapAsync(listingController.deleteListing));

router
  .route("/:id/edit")
  .get(isLoggedIn, wrapAsync(listingController.renderEditForm))
  .put(isLoggedIn, validateListing, wrapAsync(listingController.updateListing));

module.exports = router;
