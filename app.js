// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // Import the Listing model
const path = require("path");
const ejs = require("ejs");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const WrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Set the views directory

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Connect to MongoDB
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/Airbnb";
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("🟢 MongoDB connected!🟢");

    // Start the server only after the database connection is successful
    app.listen(8000, () => {
      console.log("===============================");
      console.log(" Server is running on port 8000");
      console.log("===============================");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1); // Exit the process
  });

// Routes

// Home route - basic test endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Route to display all listings
app.get(
  "/listings",
  WrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// Route to display the form for creating a new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Route to display a specific listing
app.get(
  "/listings/:id",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// Route to create a new listing

app.post(
  "/listings",
  WrapAsync(async (req, res) => {
    let result = listingSchema.validate(req.body);
    console.log(result);

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Route to edit a listing
app.get(
  "/listings/:id/edit",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// Route to update a listing
app.put(
  "/listings/:id",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
  })
);

// Use DELETE method for deleting listings

app.delete('/listings/:id', WrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
}));

// Error-handling middleware

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error", { statusCode, message });
});
