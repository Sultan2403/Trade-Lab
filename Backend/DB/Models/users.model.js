const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
      default: null
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    refreshTokenHash: { type: String, select: false },
  },
  {
    timestamps: true,
    strict: true,
  },
);

userSchema.set("toJSON", {
  transform: (doc, obj) => {
    obj.id = obj._id.toString(); // convert ObjectId to string
    delete obj._id; // remove internal _id
    delete obj.__v; // remove version key
    delete obj.password; // remove password hash
    delete obj.createdAt; // optional
    delete obj.updatedAt; // optional
    return obj;
  },
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
