const Joi= require("joi");

module.exports.listingSchema=Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    category:Joi.string().required(),
    location:Joi.string().required(),
    country:Joi.string().required(),
    price:Joi.number().required().min(0),
    image:Joi.string().allow("", null),
});

module.exports.reviewSchema=Joi.object({
    comment:Joi.string().required().messages({
    "string.empty": "Comment cannot be empty.",
    }),
    rating:Joi.number().required().min(1).max(5).messages({
    "any.required": "Please provide a rating.",
    "number.min": "Rating must be at least 1 star.",
    }),
});