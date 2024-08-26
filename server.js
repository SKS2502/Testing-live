const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // Import dotenv to use environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

const DataSchema = new mongoose.Schema({
    userAgent: String,
    platform: String,
    screenWidth: Number,
    screenHeight: Number,
    language: String,
    colorDepth: Number,
    timezone: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    ipLocation: Object,
    address: String
});

const DataModel = mongoose.model('Data', DataSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to collect device information and location data
app.post('/collect-info', async (req, res) => {
    try {
        const data = new DataModel(req.body);
        await data.save();
        console.log('Device and location data saved successfully!');
        res.json({ status: 'success' });
    } catch (err) {
        console.error('Failed to save data', err);
        res.status(500).json({ status: 'error' });
    }
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
