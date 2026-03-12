const express = require("express");
const router = express.Router();

const {
  createTrade,
  getTrades,
  getTrade,
  updateTrade,
  deleteTrade,
  uploadTrades
} = require("../Controllers/trades.controller");

const authMiddleware = require("../Middleware/auth.middleware");
const { upload, parseTrades } = require("../Middleware/csv.middleware");

router.use(authMiddleware);

router.post("/", createTrade);
router.post("/import", upload, parseTrades, uploadTrades);
router.get("/", getTrades);
router.get("/:id", getTrade);
router.patch("/:id", updateTrade);
router.delete("/:id", deleteTrade);

module.exports = router;
