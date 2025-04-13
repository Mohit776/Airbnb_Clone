// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // Import the Listing model
const path = require("path");
const ejs = require("ejs");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Set the views directory

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Connect to MongoDB
const MONGO_URL = "mongodb://localhost:27017/Airbnb";
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
  });

// Routes

// Home route - basic test endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Route to display all listings
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// Route to display the form for creating a new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Route to display a specific listing by its ID
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//route to Edit the Listing
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  res.redirect(`/listings/${id}`);
});

//Route to delete the listing
app.get("/listings/:id/delete", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});
