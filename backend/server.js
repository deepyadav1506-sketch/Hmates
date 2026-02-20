const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middleware (इसे हमेशा ऊपर रखें)
app.use(cors());
app.use(express.json());

// 2. MongoDB Connection 
// ध्यान दें: आपकी .env फाइल में MONGO_URI होना ज़रूरी है
const uri = process.env.MONGO_URI; 

mongoose.connect(uri)
    .then(() => console.log("MongoDB Connected Successfully! ✅"))
    .catch(err => console.error("Database Connection Error: ❌", err));

// 3. Basic Route
app.get('/', (req, res) => {
    res.send("Hmates Backend is Online with Database! 🚀");
});

// 4. Server Start (इसे हमेशा सबसे नीचे रखें)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});