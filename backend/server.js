const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());

/* ---------- DATABASE CONNECTION ---------- */
mongoose.connect("mongodb://127.0.0.1:27017/hmates")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

/* ---------- TEST ROUTE ---------- */
app.get("/", (req, res) => {
  res.send("HMates Backend is Online 🚀");
});


/* ---------- ROUTES ---------- */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/hostels", require("./routes/hostels"));
app.use("/api/bookings", require("./routes/bookings"));

/* ---------- SERVER ---------- */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT} 🚀`);
});