const Joi =require('joi');
const listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image : Joi.string().allow("",null),
        price:Joi.number().required().min(0),
        country :Joi.string().required(),
        category:Joi.string().required(),
        room :Joi.string().required(),
        city :Joi.string().required(),
        location:Joi.string().required()
    }).required()
});
const reviewSchema=Joi.object({
       review : Joi.object({
        rating :Joi.number().required().min(0).max(5),
        comment:Joi.string().required()
       }).required() 
});
module.exports={listingSchema,reviewSchema};
