const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  acExtra: {
    type: Number,
    default: 0
  },
  doubleDiscount: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Hostel", hostelSchema);