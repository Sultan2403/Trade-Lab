const express = require("express");
const router = express.Router();

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

router.use(authMiddleware);

router.post("/", createTrade);
router.get("/", getTrades);
router.post("/import-csv", uploadCSV, parseTrades, trade_Upload_Controller);

router.get("/:id", getTrade);
router.patch("/:id", updateTrade);
router.delete("/:id", deleteTrade);

module.exports = router;
