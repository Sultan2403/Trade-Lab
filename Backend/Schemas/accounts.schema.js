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
  timeframe: Joi.number().integer().optional(),
}).required();

const accountProfileQuerySchema = Joi.object({
  timeframe: Joi.number().integer().min(7).optional(),
});

module.exports = { accountCreateSchema, accountIdSchema };
