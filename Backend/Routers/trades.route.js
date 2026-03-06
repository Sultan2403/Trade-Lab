const express = require("express");
const router = express.Router();

const {
  createTrade,
  getTrades,
  getTrade,
  updateTrade,
  deleteTrade,
} = require("../Controllers/trades.controller");
const authMiddleware = require("../Middleware/auth.middleware");

router.use(authMiddleware);

router.post("/", createTrade);
router.get("/", getTrades);
router.get("/:id", getTrade);
router.patch("/:id", updateTrade);
router.delete("/:id", deleteTrade);

module.exports = router;
