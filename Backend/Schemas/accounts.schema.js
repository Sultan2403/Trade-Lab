const { Joi } = require("celebrate");

const accountCreateSchema = Joi.object({
  starting_balance: Joi.number().min(0).required(),
  name: Joi.string().min(3).required(),
  type: Joi.string().valid("Live", "Demo").optional(),
})
  .required()
  .options({ stripUnknown: true });

const accountIdSchema = Joi.object({
  accountId: Joi.string().hex().length(24).required(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
}).required();

module.exports = { accountCreateSchema, accountIdSchema };
