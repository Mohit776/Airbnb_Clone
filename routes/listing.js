const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js"); // Corrected path
const ExpressError = require("../utils/ExpressError.js"); // Corrected path
const Listing = require("../models/listing.js"); // Added import for Listing model
const { listingSchema, reviewSchema } = require("../schema.js"); // Corrected path
const app = express();

app.use(express.urlencoded({ extended: true }));

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.get(
  "/",
  WrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// Route to display the form for creating a new listing
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Route to display a specific listing
router.get(
  "/:id",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// Route to create a new listing

router.post(
  "/",
  validateListing,
  WrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Route to edit a listing
router.get(
  "/:id/edit",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// Route to update a listing
router.put(
  "/:id",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
  })
);

// Use DELETE method for deleting listings

router.delete(
  "/:id",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;
