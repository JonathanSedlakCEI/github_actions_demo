const path = require('node:path');
const express = require('express');

const publicDirectory = path.join(__dirname, 'public');

function createApp(options = {}) {
    const app = express();
    const apiBaseUrl = options.apiBaseUrl
        || process.env.DOCUMENT_API_BASE_URL
        || 'http://localhost:5000/api/documents';

    app.get('/config.js', (req, res) => {
        const safeApiBaseUrl = JSON.stringify(apiBaseUrl).replace(/</g, '\\u003c');
        res.type('application/javascript').send(
            `window.DOCUMENT_API_BASE_URL = ${safeApiBaseUrl};`
        );
    });

    app.use(express.static(publicDirectory));
    return app;
}

if (require.main === module) {
    const port = Number(process.env.PORT) || 3000;
    createApp().listen(port, () => {
        console.log(`Document Library frontend running on port ${port}`);
    });
}

module.exports = { createApp };
