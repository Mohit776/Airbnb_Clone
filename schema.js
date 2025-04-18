const joi = require("joi");

const listingSchema = joi.object(
    {listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        location : joi.string().required(),
        price : joi.number().required(),
        image : joi.string().allow("",null),
        country : joi.string().required()

    }).required()

    }
)
module.exports = { listingSchema };