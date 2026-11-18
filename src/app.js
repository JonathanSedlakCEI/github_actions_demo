
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

app.get('/about', (req, res) => {
    res.json({
        application: 'GitHub Actions Demo',
        version: '1.0.0'
    });
});

module.exports = app;
