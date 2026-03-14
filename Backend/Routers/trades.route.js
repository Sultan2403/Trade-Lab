const express = require("express");
const router = express.Router();

const { celebrate } = require("celebrate");
const {
  createTrade,
  getTrades,
  getTrade,
  updateTrade,
  deleteTrade,
  trade_Upload_Controller,
} = require("../Controllers/trades.controller");

const authMiddleware = require("../Middleware/auth.middleware");
const { uploadCSV, parseTrades } = require("../Middleware/csv.middleware");

const { tradeIdParamsSchema } = require("../Schemas/trades.schema");
const { accountIdSchema } = require("../Schemas/accounts.schema");

router.use(authMiddleware);

router.post("/", createTrade);

router.get("/", celebrate({ query: accountIdSchema }), getTrades);

router.post(
  "/csv-import",
  celebrate({ query: accountIdSchema }),
  uploadCSV,
  parseTrades,
  trade_Upload_Controller,
);

router.get(
  "/:id",
  celebrate({
    query: accountIdSchema,
    params: tradeIdParamsSchema,
  }),
  getTrade,
);

router.patch(
  "/:id",
  celebrate({
    query: accountIdSchema,
    params: tradeIdParamsSchema,
  }),
  updateTrade,
);

router.delete(
  "/:id",
  celebrate({
    query: accountIdSchema,
    params: tradeIdParamsSchema,
  }),
  deleteTrade,
);

module.exports = router;
