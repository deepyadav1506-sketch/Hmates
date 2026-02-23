const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../users.json");

/* REGISTER */
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  let users = JSON.parse(fs.readFileSync(filePath));

  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  users.push({ username, email, password });

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  res.status(201).json({ message: "User registered successfully ✅" });
});

/* LOGIN */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  let users = JSON.parse(fs.readFileSync(filePath));

  const user = users.find(
    user => user.email === email && user.password === password
  );

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials ❌" });
  }

  res.json({ message: "Login successful ✅" });
});

module.exports = router;