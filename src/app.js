
const express = require('express');

const app = express();

app.use(express.json());

// Welcome endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the GitHub Actions Demo!'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK'
    });
});

module.exports = app;
