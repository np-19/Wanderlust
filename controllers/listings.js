const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const {uploadOnCloudinary,deleteFromCloudinary} = require("../utils/cloudinary.js");
const fs = require("fs");
const { fetchCoordinates } = require("../utils/locationFetch.js");

module.exports.homePage = async (req, res) => {

  const allListings = await Listing.find();

    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createNewListing = async (req, res) => {
  let newListing = new Listing(req.body.Listing);
  console.log(newListing);
  if (req.file) {
    let response = await uploadOnCloudinary(req.file.path);
    if (!response) {
      req.flash("error", "file upload failed");
      return res.redirect("/listings/new");
    }

    fs.unlinkSync(req.file.path);
    newListing.image.url = response.secure_url; //to set location of file in mogodb if using upload folder
    newListing.image.filename = response.public_id;
  }

  try {
    let address = newListing.location + "," + newListing.country;
    let geometry = await fetchCoordinates(address); //fetch coordinates
    newListing.geometry = geometry;
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }

  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing added!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner"); //populate to get username
  if (!listing) {
    req.flash("error", "Listing not found!");
    res.redirect("/listings");
    // throw new ExpressError(404, "Listing not found!");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found!");
  }
  let url = listing.image.url;
  url = url.replace("/upload", "/upload/w_250,c_fill");
  res.render("listings/edit.ejs", { listing, url });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  listing.set(req.body.Listing)

  if (typeof req.file !== "undefined") {
   if (listing.image?.filename) {
    await deleteFromCloudinary(listing.image.filename);
  }
    let response = await uploadOnCloudinary(req.file.path);
    if (!response) {
      req.flash("error", "file upload failed");
      return res.redirect(`/listings/${id}/edit`);
    }
    fs.unlinkSync(req.file.path); //remove file from tmp folder
    listing.image = {
      url: response.secure_url,
      filename: response.public_id,
    };
  }
  try {
    let address = listing.location + "," + listing.country;
    let geometry = await fetchCoordinates(address); //fetch coordinates
    listing.geometry = geometry;
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
  
  // await Listing.findByIdAndUpdate(id,  {...listing },{ runValidators: true });
  await listing.save();
  console.log(listing);

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    throw new ExpressError(404, "Listing not found!");
  }
  req.flash("success", "Listing deleted!");
  res.redirect(`/listings`);
};
