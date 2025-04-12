const mongoose = require("mongoose");


const listingSchema = new mongoose.Schema({
title : {type :String,
required : true
},
description : String,
image: {type: String,
 // default: "https://media.istockphoto.com/id/1127245421/photo/woman-hands-praying-for-blessing-from-god-on-sunset-background.webp?s=1024x1024&w=is&k=20&c=faoiFapQkhucuLuor9gBnblJ4KJpqvEgariqalvzRas=",
    //set : (v) => v==="" ? "https://media.istockphoto.com/id/1127245421/photo/woman-hands-praying-for-blessing-from-god-on-sunset-background.webp?s=1024x1024&w=is&k=20&c=faoiFapQkhucuLuor9gBnblJ4KJpqvEgariqalvzRas=":v

},
price : Number,
location : String,
country : String
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;