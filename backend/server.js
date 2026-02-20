const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware (यह डेटा को समझने में मदद करता है)
app.use(cors());
app.use(express.json());

// Basic Route (चेक करने के लिए कि सर्वर चल रहा है या नहीं)
app.get('/', (req, res) => {
    res.send("Hmates Backend is Online! 🚀");
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});