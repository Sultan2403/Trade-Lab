const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    starting_balance: {
      type: Number,
      required: true,
      min: 0
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

accountSchema.set("toJSON", {
  transform: (doc, obj) => {
    obj.id = obj._id.toString(); // convert ObjectId to string
    delete obj._id; // remove internal _id
    delete obj.__v; // remove version key
    delete obj.createdAt; // optional
    delete obj.updatedAt; // optional
    return obj;
  },
});

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;
