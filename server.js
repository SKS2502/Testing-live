const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to collect device information and location data
app.post('/collect-info', (req, res) => {
    const {
        userAgent,
        platform,
        screenWidth,
        screenHeight,
        language,
        colorDepth,
        timezone,
        location
    } = req.body;

    // Format the log data
    const logData = `User Agent: ${userAgent}\n` +
                    `Platform: ${platform}\n` +
                    `Screen Width: ${screenWidth}\n` +
                    `Screen Height: ${screenHeight}\n` +
                    `Language: ${language}\n` +
                    `Color Depth: ${colorDepth}\n` +
                    `Timezone: ${timezone}\n` +
                    `Location Latitude: ${location.latitude}\n` +
                    `Location Longitude: ${location.longitude}\n` +
                    `----------------------\n`;

    // Log the device data (for now, we'll log it to a file)
    fs.appendFile('device_info_log.txt', logData, (err) => {
        if (err) {
            console.error('Failed to write to log file', err);
            return res.status(500).json({ status: 'error' });
        }
        console.log('Device and location data logged successfully!');
        res.json({ status: 'success' });
    });
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
