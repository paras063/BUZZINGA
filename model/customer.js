const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, lowercase: true },
  lastName: { type: String, required: true, trim: true, lowercase: true },
  email: { type: String, required: true},
  contact: { type: String, required:true },
  firms: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Firm" }],
  address: {
    address: String,
    city: String,
    state: String,
    pincode: Number,
    country:String
  },
},{timestamps:true});

module.exports = mongoose.model("Customer", customerSchema);
