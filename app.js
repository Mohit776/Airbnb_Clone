// =======================
// Import Required Modules
// =======================
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const dotenv = require("dotenv");

// =======================
// Load Environment Variables
// =======================
dotenv.config();

// =======================
// Import Routes
// =======================
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

// =======================
// Initialize Express App
// =======================
const app = express();

// =======================
// Set Up View Engine
// =======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// =======================
// Middleware
// =======================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// =======================
// Routes
// =======================
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// Home Route - Basic Test Endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// =======================
// MongoDB Connection
// =======================
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

// =======================
// Error Handling Middleware
// =======================
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { statusCode, message });
});