const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

name: String,
phone: String,
hostelName: String,
sharing: String,
roomType: String,
price: Number,

ownerId: String,

createdAt: {
type: Date,
default: Date.now
}

});

module.exports = mongoose.model("Booking", bookingSchema);