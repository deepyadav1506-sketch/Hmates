const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());

/* ---------- TEST ROUTE ---------- */
app.get("/", (req, res) => {
  res.send("HMates Backend is Online 🚀");
});

/* ---------- DATABASE ---------- */

/* ---------- ROUTES ---------- */
app.use("/api/auth", require("./routes/auth"));

/* ---------- SERVER ---------- */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT} 🚀`);
});