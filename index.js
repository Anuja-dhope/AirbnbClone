// const express=require("express");
// const app=express(); 
// const mongoose=require("mongoose");
// const Listing=require("./model/listings.js");
// const path=require("path");
// const methodOverride = require("method-override");
// const ejsMate=require("ejs-mate");
// const wrapAync=require("./utils/wrapAsync.js");
// const ExpressError=require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema} =require("./schema.js");
// const Review=require("./model/review.js");  
// const listings=require("./routes/listing.js");
// const reviews=require("./routes/review.js");
// const expressSession =require("express-session");
// const flash=require("connect-flash");

// app.use(methodOverride("_method"));
// app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"views"));
// app.use(express.static(path.join(__dirname,"public")));
// app.use(express.urlencoded({ extended: true }));
// app.engine('ejs', ejsMate); 
// app.set('view engine', 'ejs');
// app.use("/listings",listings);
// app.use("/listings/:id/reviews",reviews);

// mongoose.connect('mongodb://127.0.0.1:27017/wanderLust')
//   .then(() => console.log('Connected!'))
//   .catch(err=>console.log("Error occured while connecting to db"));

// const sessionOptions={
//   secret:"mySecret",
//   resave:false,
//   saveUninitialized:true,
//   cookie:{
//     expires:Date.now() + 24*7*3600*1000,
//     maxAge: 24*7*3600*1000,
//   }
// }

// app.use(expressSession(sessionOptions));
// app.use(flash());

 
// // //page not found
// // app.all("/", (req, res, next) => {
// //   next(new ExpressError(404, "Page Not Found"));
// // });

// app.use((req,res,next)=>{
//   res.locals.success=req.flash("success");
//   next();
// });

// app.get("/",(req,res)=>{
//     res.send("Connected!");
// })



// //Error Handling
// app.use((err, req, res, next) => {
//   const { statusCode = 500, message = "Something went wrong!" } = err;
//   res.status(statusCode).render("error.ejs",{message});;
// });

// app.listen(8080,(req,res)=>{
//     console.log("App is Listening");
//   });

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressSession = require("express-session");
const flash = require("connect-flash");

const Listing = require("./model/listings.js");
const Review = require("./model/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// Middleware setup
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// ✅ Session & Flash BEFORE routes
const sessionOptions = {
  secret: "mySecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};
app.use(expressSession(sessionOptions));
app.use(flash());

// ✅ Make flash messages available globally
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error"); // optional
  next();
});

// Routes AFTER session & flash
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// Root route
app.get("/", (req, res) => {
  res.send("Connected!");
});

// Error handling
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// DB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wanderLust")
  .then(() => console.log("Connected!"))
  .catch((err) => console.log("Error occurred while connecting to db"));

// Server
app.listen(8080, () => {
  console.log("App is Listening");
});