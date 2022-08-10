const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
  {
    saleDate:{
      type:Date,
      required:true
    },
    sellerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    customerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Customer",
      required: true,
    },
    firmId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Firm",
      required: true,
    },
    totalAmt: Number,
    items: [
      {
      itemId:{
          type:mongoose.SchemaTypes.ObjectId,
          required:true,
          ref:"Product"
      },
      name:{
          type:String,
          required:true,
          lowercase:true,
      },
      quantity:{
          type:Number,
          required:true,
          default:1
      },
      unitPrice:{
          type:Number,
          required:true
      },
      itemTotal:{
          type:Number,
          required:true
      }
  }
],
  invoiceId:{
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Invoice",
    required: true,
  }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", salesSchema);
