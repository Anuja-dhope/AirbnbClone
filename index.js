// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const expressSession = require("express-session");
// const flash = require("connect-flash");
// const passport=require("passport");
// const LocalStrategy=require("passport-local");


// const Listing = require("./model/listings.js");
// const Review = require("./model/review.js");
// const User = require("./model/user.js");

// const listingsRouter = require("./routes/listing.js");
// const reviewsRouter = require("./routes/review.js");
// const userRouter=require("./routes/user.js");

// const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");

// // Middleware setup
// app.use(methodOverride("_method"));
// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Session & Flash BEFORE routes
// const sessionOptions = {
//   secret: "mySecret",
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   },
// };
// app.use(expressSession(sessionOptions));
// app.use(flash());
// app.use(passport.initialize());//for user login
// app.use(passport.session());
// //use static authenticate method of model in LocalStrategy
// passport.use(new LocalStrategy(User.authenticate()));

// //use static serialize and deserialize of model for passport session support
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// //  Make flash messages available globally
// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error"); // optional
//   res.locals.currUser=req.user;
//   next();
// });

// // Routes AFTER session & flash
// app.use("/listings", listingsRouter);
// app.use("/listings/:id/reviews", reviewsRouter);
// app.use("/",userRouter);

// // Root route
// app.get("/", (req, res) => {
//   res.send("WanderLust..........................");
// });

// // Error handling
// app.use((err, req, res, next) => {
//   const { statusCode = 500, message = "Something went wrong!" } = err;
//   res.status(statusCode).render("error.ejs", { message });
// });

// // DB connection
// mongoose
//   .connect("mongodb://127.0.0.1:27017/wanderLust")
//   .then(() => console.log("Connected!"))
//   .catch((err) => console.log("Error occurred while connecting to db"));

// // Server
// app.listen(8080, () => {
//   console.log("App is Listening");
// });
let env=require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./model/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const db_url=process.env.ATLASDB_URL;//mongo atlas url for storing db
// ------------------ MIDDLEWARE ------------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));


// ------------------ SESSION ------------------

const store=MongoStore.create({
  mongoUrl:db_url,
  crypto:{
    secret: "mySecret",
  },
  touchAfter:24*3600,
});

store.on("error",(error)=>{
  console.log("Mongo Error",error);
})

const sessionOptions = {
  store,
  secret: "mySecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ------------------ PASSPORT ------------------
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ------------------ GLOBAL LOCALS ------------------
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ------------------ ROUTES ------------------

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
  res.send("Page Not Found :(")
});

// ------------------ ERROR HANDLER ------------------
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// ------------------ DB ------------------
mongoose
  .connect(db_url)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
