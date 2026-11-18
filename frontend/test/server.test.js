const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { createApp } = require('../server');

async function withServer(app, run) {
    const server = createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();

    try {
        await run(`http://127.0.0.1:${address.port}`);
    } finally {
        await new Promise((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve());
        });
    }
}

test('serves the frontend and injects a configurable backend URL', async () => {
    await withServer(createApp({ apiBaseUrl: 'http://localhost:5000/api/documents' }), async (url) => {
        const [page, config] = await Promise.all([
            fetch(url),
            fetch(`${url}/config.js`)
        ]);

        assert.equal(page.status, 200);
        assert.match(await page.text(), /Document Library/);
        assert.equal(config.status, 200);
        assert.match(await config.text(), /http:\/\/localhost:5000\/api\/documents/);
    });
});
