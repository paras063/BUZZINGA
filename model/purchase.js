const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    firmId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Firm",
      required: true,
    },
    name: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    stock: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true },
    images: Array
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", purchaseSchema);