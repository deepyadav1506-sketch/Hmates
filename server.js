const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Deepak ki static files (HTML, CSS, JS) ko server se connect karna
// Note: Path wahi hai jo aapke screenshot mein dikh raha hai
app.use(express.static(path.join(__dirname, 'Hmates/Hmates')));

// Default route: Jab koi website khole toh index.html dikhe
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Hmates/Hmates/index.html'));
});

// Server start karne ka message
app.listen(PORT, () => {
    console.log(`Hmates website yahan chal rahi hai: http://localhost:${PORT}`);
});