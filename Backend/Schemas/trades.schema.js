const { Joi } = require("celebrate");

const createTradeSchema = Joi.object({
  pair: Joi.string().trim().required().uppercase(),

  direction: Joi.string().valid("Long", "Short").required(),

  entry_price: Joi.number().precision(5).required(),

  stopLoss: Joi.number().precision(5).allow(null).optional(),

  takeProfit: Joi.number().precision(5).allow(null).optional(),

  size: Joi.number().precision(2).required(),

  riskPercent: Joi.number().min(0.01).max(100).allow(null).optional(),

  status: Joi.string().valid("Open", "Closed").default("Open"),

  exit_price: Joi.when("status", {
    is: "Closed",
    then: Joi.number().precision(5).required(),
    otherwise: Joi.valid(null).optional(),
  }),

  openedAt: Joi.date().max("now").required().messages({
    "date.max": "Opened date cannot be in the future",
  }),

  closedAt: Joi.when("status", {
    is: "Closed",
    then: Joi.date().max("now").min(Joi.ref("openedAt")).required(),
    otherwise: Joi.valid(null).optional(),
  }).messages({
    "date.max": "Closed date cannot be in the future",
    "date.min": "Closed date cannot be before opened date",
  }),

  duration: Joi.when("status", {
    is: "Closed",
    then: Joi.string().trim().min(1).required(),
    otherwise: Joi.valid(null).optional(),
  }),

  pnl: Joi.when("status", {
    is: "Closed",
    then: Joi.number().required(),
    otherwise: Joi.valid(null).optional(),
  }),

  outcome: Joi.when("status", {
    is: "Closed",
    then: Joi.string().valid("Win", "Loss", "Breakeven").required(),
    otherwise: Joi.valid(null).optional(),
  }),

  riskToReward: Joi.number().allow(null).optional(),

  notes: Joi.string().max(500).allow("").optional(),

  chartUrl: Joi.string().uri().max(500).allow("", null).optional(),

  tags: Joi.array().items(Joi.string().trim().max(20)).max(10).optional(),
})
  .custom((value, helpers) => {
    if (value.direction === "Long") {
      if (typeof value.stopLoss === "number" && value.stopLoss >= value.entry_price) {
        return helpers.message("Stop loss must be below entry for long trades");
      }

      if (typeof value.takeProfit === "number" && value.takeProfit <= value.entry_price) {
        return helpers.message("Take profit must be above entry for long trades");
      }
    }

    if (value.direction === "Short") {
      if (typeof value.stopLoss === "number" && value.stopLoss <= value.entry_price) {
        return helpers.message("Stop loss must be above entry for short trades");
      }

      if (typeof value.takeProfit === "number" && value.takeProfit >= value.entry_price) {
        return helpers.message("Take profit must be below entry for short trades");
      }
    }

    return value;
  })
  .options({ stripUnknown: true })
  .required();

const tradeIdParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
}).required();

module.exports = { tradeIdParamsSchema, createTradeSchema };
