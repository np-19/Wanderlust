if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash"); //used to flash a message just once like user registered
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const multer = require("multer");

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;



const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: process.env.SECRET,
  }
  
})

store.on("error", function (e) {
  console.log("SESSION MONGO STORE ERROR", e);
});


let sessionOptions = {
  store,
  secret:  process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};



app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(session(sessionOptions)); // before passport
app.use(flash());
app.use(passport.initialize()); //initializes passport authentication module
app.use(passport.session()); //enable persistent login for each session
passport.use(new LocalStrategy(User.authenticate())); //to use the "local" strategy
passport.serializeUser(User.serializeUser()); //to serialise data
passport.deserializeUser(User.deserializeUser()); // to deserialise data

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.use((req, res, next) => {
  // console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url} ${req.hostname} ${req.ip}`);
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error"); //use before links
  res.locals.currentUser = req.user;
  res.locals.imageName = req.body.uploaded_image;
  next();
});

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const featureRouter = require("./routes/listingFeatures.js")

app.use("/listings/results", featureRouter);
app.use("/listings", listingRouter); // listings -- parent route & child routes are in listings.js
app.use("/listings/:id/reviews", reviewRouter); // listings/:id/reviews -- parent route & child routes are in reviews.js
app.use("/", userRouter);

//404 Error handling for all other routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "PAGE NOT FOUND!"));
});

app.use((err, req, res, next) => {
  if (
    err instanceof multer.MulterError ||
    err.message.includes("Only images are allowed (.png, .jpg, .jpeg)")
  ) {
    req.flash("error", err.message);
    return res.redirect("back");
  }
  next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { err });
});

const port = 8080;
app.listen(port, () => {
  console.log("listening to port : ", port);
});
