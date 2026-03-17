const { celebrate } = require("celebrate");
const express = require("express");

const {
  equityCurveController,
} = require("../Controllers/analytics.controller");

const {
  accountIdSchema,
} = require("../Schemas/accounts.schema");

const router = express.Router();

router.get(
  "/equity-curve",
  celebrate({ query: accountIdSchema }),
  equityCurveController,
);

module.exports = router;
