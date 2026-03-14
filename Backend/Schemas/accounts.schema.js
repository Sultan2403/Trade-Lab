const { Joi } = require("celebrate");

const accountCreateSchema = Joi.object({
  starting_balance: Joi.number().min(0).required(),
  name: Joi.string().min(3).required()
})
  .required()
  .options({ stripUnknown: true });

const accountIdQuerySchema = Joi.object({
  accountId: Joi.string().hex().length(24).required(),
}).required();


module.exports = { accountCreateSchema, accountIdQuerySchema };
