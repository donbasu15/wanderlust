const Joi=require("joi");

module.exports.listingSchema = Joi.object({
   
    title: Joi.string()
         .required(),
    image: Joi.string()
        .allow(null).allow('').optional(),
    description: Joi.string()
        .required(),
    price: Joi.number()
        .required(),
    location: Joi.string()
        .required(),
    country: Joi.string()
        .required(),



});



module.exports.reviewSchema = Joi.object({

        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),

});