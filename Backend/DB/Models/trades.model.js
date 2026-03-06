const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pair: {
      type: String,
      required: true,
    },

    direction: {
      type: String,
      enum: ["long", "short"],
      required: true,
    },

    entryPrice: {
      type: Number,
      required: true,
    },

    stopLoss: {
      type: Number,
      required: true,
    },

    takeProfit: {
      type: Number,
      required: true,
    },

    positionSize: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    closedPrice: {
      type: Number,
    },

    closedAt: {
      type: Date,
    },

    notes: {
      type: String,
    },

    chartUrl: {
      type: String,
    },

    tags: [String],

    riskPercent: {
      type: Number,
    },
  },
  { timestamps: true, strict: true },
);

module.exports = mongoose.model("Trade", tradeSchema, "trades");
