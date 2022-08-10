const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, lowercase: true },
    lastName: { type: String, required: true, trim: true, lowercase: true },
    email: { type: String, required: true },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
    Token: { type: String },
    contact: { type: String, required: true },
    typeOfUser: {
      type: String,
      default: "Employee",
      lowercase: true,
      trim: true,
    },
    isAdmin: { type: Boolean, default: false },
    firms: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Firm" }],
    address: {
      address: String,
      city: String,
      state: String,
      pincode: Number,
      country: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
