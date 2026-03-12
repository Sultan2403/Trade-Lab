const { Joi } = require("celebrate");

const tradeSchema = Joi.object({
  pair: Joi.string().required().uppercase(),

  entryPrice: Joi.number().precision(5).required(),

  stopLoss: Joi.number().precision(5).optional(),

  takeProfit: Joi.number().precision(5).optional(),

  positionSize: Joi.number().precision(2).required(),

  riskPercent: Joi.number().min(0.01).max(100).required(),

  tags: Joi.array().items(Joi.string().max(20)).max(10),

  status: Joi.string().valid("Open", "Closed").default("Open"),

  direction: Joi.string().valid("Long", "Short").required(),

  closedPrice: Joi.when("status", {
    is: "Closed",
    then: Joi.number().precision(5).required(),
    otherwise: Joi.number().precision(5).optional(),
  }),

  openedAt: Joi.date()
    .max("now")
    .required()
    .messages({ "date.max": "Opened date cannot be in the future" }),

  closedAt: Joi.date()
    .max("now")
    .min(Joi.ref("openedAt"))
    .when("status", { is: "Closed", then: Joi.required() })
    .messages({
      "date.max": "Closed date cannot be in the future",
      "date.min": "Closed date cannot be before opened date",
    }),

  notes: Joi.string().max(500).allow(""),

  // chartUrl: Joi.string().uri().max(500),
});

module.exports = { tradeSchema };
