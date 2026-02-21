const express = require("express");
const router = express.Router();
const User = require("../models/user");

/* ---------- REGISTER ---------- */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully ✅" });

  } catch (err) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

module.exports = router;