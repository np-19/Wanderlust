const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    Listing: Joi.object({
        title: Joi.string().required(),
        categories: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.object({
            url:    Joi.string().allow("", null)})
    }).required()
})
module.exports.reviewSchema = Joi.object({ 
    Review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
    }).required()
})