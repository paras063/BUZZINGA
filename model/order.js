const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    packageId: { type: mongoose.SchemaTypes.ObjectId, ref: "Package" },
    onwerId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    paymentMethod: { type: String, default: "online",lowercase:true },
    paymentId:{type:String,required:true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
