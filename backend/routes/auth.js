const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");



/* REGISTER */
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully ✅" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

  // 🔐 HASH PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    username,
    email,
    password: hashedPassword
  });

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  res.status(201).json({ message: "User registered successfully ✅" });
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let users = JSON.parse(fs.readFileSync(filePath));

  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials ❌" });
  }

  // 🔐 COMPARE HASH
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials ❌" });
  }

  res.json({ message: "Login successful ✅" });
});

module.exports = router;