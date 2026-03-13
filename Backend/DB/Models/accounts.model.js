const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {

    account_owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    starting_balance: {
      type: Number,
      required: true,
    },

    current_balance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);
const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;
