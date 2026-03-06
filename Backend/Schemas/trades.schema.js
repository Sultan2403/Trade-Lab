const {Joi} = require("celebrate")

const tradeSchema = Joi.object({
  pair: Joi.string().required(),
  entryPrice: Joi.number().precision(5).required(),
  stopLoss: Joi.number().precision(5).required(),
  takeProfit: Joi.number().precision(5).required(),
  positionSize: Joi.number().precision(2).required(),
  riskPercent: Joi.number().min(0.01).required(),
  tags: Joi.array().items(Joi.string()),
  status: Joi.string().valid("open", "closed").default("open"),
});

module.exports = {tradeSchema}