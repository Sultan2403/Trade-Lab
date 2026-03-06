const mongoose = require("mongoose");

const TRANSACTION_STATUSES = ["Processing", "Failed", "Successful"];
const TRANSACTION_TYPES = ["TOP-UP", "AIRTIME", "DATA"];

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      default: "Processing",
      enum: TRANSACTION_STATUSES,
      required: true,
    },

    amount:{
      type: Number, 
      required: true
    },
    
    type: {
      type: String,
      enum: TRANSACTION_TYPES,
      required: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema,
  "transactions",
);

module.exports = Transaction;
