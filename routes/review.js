const express = require("express");
const router = express.Router({ mergeParams: true });
const app = express();
const WrapAsync = require("../utils/WrapAsync.js"); // Corrected path
const ExpressError = require("../utils/ExpressError.js"); // Corrected path
const Listing = require("../models/listing.js"); // Import Listing model
const Review = require("../models/review.js"); // Renamed to follow convention
const { reviewSchema } = require("../schema.js"); // Corrected path

app.use(express.urlencoded({ extended: true }));

const validateReview = (req, res, next) => {
  if (!req.body || !req.body.review) {
    throw new ExpressError(400, "Invalid Review Data");
  }

  let { error } = reviewSchema.validate(req.body.review);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  WrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${req.params.id}`);
  })
);

module.exports = router;
