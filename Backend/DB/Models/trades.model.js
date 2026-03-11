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
      set: (v) => v.toUpperCase(),
    },

    direction: {
      type: String,
      enum: ["Long", "Short"],
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
      enum: ["Open", "Closed"],
      default: "Open",
    },

    closedPrice: {
      type: Number,
    },

    openedAt: {
      type: Date,
      required: function () {
        return this.status === "Open";
      },
    },
    
    closedAt: {
      type: Date,
      required: function () {
        return this.status === "Closed";
      },
    },

    notes: {
      type: String,
      maxlength: 500,
    },

    chartUrl: {
      type: String,
      maxlength: 500,
    },

    tags: [String],

    riskPercent: {
      type: Number,
      required: true,
      min: 0.01,
    },
  },
  { timestamps: true, strict: true },
);

module.exports = mongoose.model("Trade", tradeSchema, "trades");
