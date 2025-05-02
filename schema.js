const joi = require("joi");



module.exports = {
    reviewSchema: joi.object({
      rating: joi.number().min(1).max(5).required(),
      comment: joi.string().required()
    }),
    
    listingSchema: joi.object({
      listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.string().allow("", null),
        country: joi.string().required()
      }).required()
    })
  };
  


  

