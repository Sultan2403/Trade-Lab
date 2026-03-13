const { Joi } = require("celebrate");

const tradeSchema = Joi.object({
  pair: Joi.string().required().uppercase(),

  direction: Joi.string().valid("Long", "Short").required(),

  entry_price: Joi.number().precision(5).required(),

  stopLoss: Joi.number().precision(5).optional(),

  takeProfit: Joi.number().precision(5).optional(),

  size: Joi.number().precision(2).required(),

  riskPercent: Joi.number().min(0.01).max(100).required(),

  status: Joi.string().valid("Open", "Closed").default("Open"),

  exit_price: Joi.when("status", {
    is: "Closed",
    then: Joi.number().precision(5).required(),
    otherwise: Joi.number().precision(5).optional(),
  }),

  openedAt: Joi.date().max("now").required().messages({
    "date.max": "Opened date cannot be in the future",
  }),

  closedAt: Joi.date()
    .max("now")
    .min(Joi.ref("openedAt"))
    .when("status", { is: "Closed", then: Joi.required() })
    .messages({
      "date.max": "Closed date cannot be in the future",
      "date.min": "Closed date cannot be before opened date",
    }),

  notes: Joi.string().max(500).allow(""),

  tags: Joi.array().items(Joi.string().max(20)).max(10).optional(),
})
  .custom((value, helpers) => {
    if (value.direction === "Long") {
      if (value.stopLoss >= value.entry_price) {
        return helpers.message("Stop loss must be below entry for long trades");
      }

      if (value.takeProfit <= value.entry_price) {
        return helpers.message(
          "Take profit must be above entry for long trades",
        );
      }
    }

    if (value.direction === "Short") {
      if (value.stopLoss <= value.entry_price) {
        return helpers.message(
          "Stop loss must be above entry for short trades",
        );
      }

      if (value.takeProfit >= value.entry_price) {
        return helpers.message(
          "Take profit must be below entry for short trades",
        );
      }
    }

    return value;
  })
  .options({ stripUnknown: true });

module.exports = { tradeSchema };
