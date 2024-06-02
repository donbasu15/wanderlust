const Joi=require("joi");

const Schema = Joi.object({
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

module.exports = Schema;