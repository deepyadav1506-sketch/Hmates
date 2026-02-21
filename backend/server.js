const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
// 2. MongoDB Connection
const uri = process.env.MONGO_URI; 

if (!uri) {
    console.error("Error: MONGO_URI is not defined in .env file! ❌");
} else {
    mongoose.connect(uri)
        .then(() => console.log("MongoDB Connected Successfully! ✅"))
        .catch(err => {
            console.error("Database Connection Error: ❌");
            console.error(err);
        });
}

// 3. Basic Route
app.get('/', (req, res) => {
    res.send("Hmates Backend is Online with Database! 🚀");
});

// 4. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});