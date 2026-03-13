const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    external_id: {
      type: String,
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

    entry_price: {
      type: Number,
      required: true,
    },

    stopLoss: {
      type: Number,
      required: false,
    },

    takeProfit: {
      type: Number,
      required: function () {
        return this.status === "Closed";
      },
    },

    size: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },

    exit_price: {
      type: Number,
      required: function () {
        return this.status === "Closed";
      },
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

    pnl: {
      type: Number,
      required: function () {
        return this.status === "Closed";
      },
    },

    notes: {
      type: String,
      maxlength: 500,
      required: false,
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

    metadata: {
      swap: { type: Number, default: null },
      commission: { type: Number, default: null },
      source: {
        type: String,
        enum: ["csv-import", "manual-entry"],
        required: true,
      },
    },
  },
  { timestamps: true, strict: true },
);

tradeSchema.index(
  { userId: 1, external_id: 1 },
  { unique: true, sparse: true },
);

module.exports = mongoose.model("Trade", tradeSchema, "trades");
