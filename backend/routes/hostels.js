const express = require("express");
const router = express.Router();
const Hostel = require("../models/hostel");

/* ADD HOSTEL */
router.post("/", async (req, res) => {
  try {
    const hostel = new Hostel(req.body);
    await hostel.save();
    res.status(201).json({ message: "Hostel added successfully", hostel });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* GET ALL HOSTELS */
router.get("/", async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* DELETE HOSTEL */
router.delete("/:id", async (req, res) => {
  try {
    await Hostel.findByIdAndDelete(req.params.id);
    res.json({ message: "Hostel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;