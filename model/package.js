const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    validity: { type: Number, required: true, min: 1, max: 12 },
    price: { type: Number, required: true },
    enrolled: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
    servicesProvide:Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
