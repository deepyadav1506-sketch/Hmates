const express = require("express");
const router = express.Router();
const Hostel = require("../models/hostel");


/* ADD HOSTEL */
router.post("/", async (req, res) => {

try{

const hostel = new Hostel({

name: req.body.name,
institution: req.body.institution,
gender: req.body.gender,
basePrice: req.body.basePrice,
acExtra: req.body.acExtra,
doubleDiscount: req.body.doubleDiscount,
location: req.body.location,
ownerId: req.body.ownerId

});

await hostel.save();

res.status(201).json({

message: "Hostel added successfully",
hostel

});

}catch(error){

console.error(error);
res.status(500).json({ message: "Server error" });

}

});


/* GET ALL HOSTELS (FOR STUDENTS) */
router.get("/", async (req, res) => {

try{

const hostels = await Hostel.find();

res.json(hostels);

}catch(error){

console.error(error);
res.status(500).json({ message: "Server error" });

}

});


/* GET HOSTELS OF SPECIFIC OWNER */
router.get("/owner/:ownerId", async (req, res) => {

try{

const hostels = await Hostel.find({ ownerId: req.params.ownerId });

res.json(hostels);

}catch(error){

console.error(error);
res.status(500).json({ message: "Server error" });

}

});


/* DELETE HOSTEL */
router.delete("/:id", async (req, res) => {

try{

await Hostel.findByIdAndDelete(req.params.id);

res.json({ message: "Hostel deleted successfully" });

}catch(error){

console.error(error);
res.status(500).json({ message: "Server error" });

}

});


module.exports = router;