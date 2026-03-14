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
const { accountIdQuerySchema } = require("../Schemas/accounts.schema");

router.use(authMiddleware);

router.post("/", createTrade);

router.get("/", celebrate({ query: accountIdQuerySchema }), getTrades);

router.post(
  "/csv-import",
  celebrate({ query: accountIdQuerySchema }),
  uploadCSV,
  parseTrades,
  trade_Upload_Controller,
);

router.get(
  "/:id",
  celebrate({
    query: accountIdQuerySchema,
    params: tradeIdParamsSchema,
  }),
  getTrade,
);

router.patch(
  "/:id",
  celebrate({
    query: accountIdQuerySchema,
    params: tradeIdParamsSchema,
  }),
  updateTrade,
);

router.delete(
  "/:id",
  celebrate({
    query: accountIdQuerySchema,
    params: tradeIdParamsSchema,
  }),
  deleteTrade,
);

module.exports = router;
