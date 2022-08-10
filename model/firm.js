const mongoose = require("mongoose");

const firmSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, lowercase: true },  
  ownerId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  email: { type: String, required: true},
  contact: { type: String,required:true},
  address: {
    address: String,
    city: String,
    state: String,
    pincode: Number,
    country:String
  },
  type:{type:String},
  gstNo:{type:String,uppercase:true},
},{timestamps:true});

module.exports = mongoose.model("Firm", firmSchema);
