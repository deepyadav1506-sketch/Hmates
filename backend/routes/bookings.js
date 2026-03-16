const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");


/* ADD BOOKING */
router.post("/", async (req, res) => {

try{

const booking = new Booking({

name: req.body.name,
phone: req.body.phone,
hostelName: req.body.hostelName,
sharing: req.body.sharing,
roomType: req.body.roomType,
price: req.body.price,
ownerId: req.body.ownerId

});

await booking.save();

res.status(201).json({
message: "Booking request saved",
booking
});

}catch(error){

console.error(error);
res.status(500).json({ message: "Server error" });

}

});


/* GET BOOKINGS FOR OWNER */
router.get("/owner/:ownerId", async (req, res) => {

try{

const bookings = await Booking.find({ ownerId: req.params.ownerId });

res.json(bookings);

}catch(error){

console.error(error);
res.status(500).json({ message: "Server error" });

}

});

module.exports = router;