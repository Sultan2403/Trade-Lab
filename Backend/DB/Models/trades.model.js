const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true
    },

    external_id: {
      type: String,
      required: function () {
        return this.metadata?.source === "csv-import";
      },
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
      default: null,
    },

    takeProfit: {
      type: Number,
      required: false,
      default: null,
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
      required: false,
      min: 0.01,
      default: null
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
  { accountId: 1, external_id: 1 },
  { unique: true, sparse: true },
);


tradeSchema.set("toJSON", {
  transform: (doc, obj) => {
    obj.id = obj._id.toString(); // convert ObjectId to string
    delete obj._id; // remove internal _id
    delete obj.__v; // remove version key
    delete obj.createdAt; // optional
    delete obj.updatedAt; // optional
    return obj;
  },
});

module.exports = mongoose.model("Trade", tradeSchema, "trades");
