const Joi = require('joi');

// const listingSchema = Joi.object({
//   title: Joi.string().trim().required(),
//   description: Joi.string().trim().required(),
//   price: Joi.number().integer().min(0).required(),
//   location: Joi.string().trim().required(),
//   country: Joi.string().trim().required(),
//   image: Joi.object({
//     filename: Joi.string().required(),
//     url: Joi.string().uri().allow('').default(
//       "https://images.unsplash.com/photo-1736618625357-2a7f197f8c23?..."
//     )
//   }).required()
// });

const reviewSchema = Joi.object({
  comment: Joi.string().trim().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
});





const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().allow("", null),
    }),
  }).required(),
});


module.exports = {
  listingSchema,
  reviewSchema
};