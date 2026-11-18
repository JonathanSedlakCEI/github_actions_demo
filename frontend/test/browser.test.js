const { test } = require('node:test');
const assert = require('node:assert/strict');

class FakeElement {
    constructor() {
        this.value = '';
        this.children = [];
        this.hidden = false;
        this.listeners = {};
        this.textContent = '';
    }

    append(...elements) {
        this.children.push(...elements);
    }

    replaceChildren(...elements) {
        this.children = elements;
    }

    addEventListener(eventName, listener) {
        this.listeners[eventName] = listener;
    }
}

function createDocumentStub() {
    const elements = new Map([
        ['#search-input', new FakeElement()],
        ['#category-filter', new FakeElement()],
        ['#document-list', new FakeElement()],
        ['#result-count', new FakeElement()],
        ['#loading-message', new FakeElement()],
        ['#error-message', new FakeElement()],
        ['#empty-message', new FakeElement()]
    ]);

    return {
        elements,
        querySelector: (selector) => elements.get(selector),
        createElement: () => new FakeElement()
    };
}

function elementText(element) {
    return [element.textContent, ...element.children.map(elementText)].join(' ');
}

async function waitForFetch() {
    await new Promise((resolve) => setTimeout(resolve, 0));
}

test('fetches and renders documents, then applies search and category filters', async () => {
    const previousDocument = global.document;
    const previousWindow = global.window;
    const previousFetch = global.fetch;
    const documentStub = createDocumentStub();
    const sampleDocuments = [
        { name: 'Quarterly Budget', description: 'Budget details', category: 'Finance', fileType: 'PDF', lastModified: '2026-10-15' },
        { name: 'Benefits Handbook', description: 'Employee benefits', category: 'Human Resources', fileType: 'DOCX', lastModified: '2026-08-12' }
    ];
    const requests = [];

    global.document = documentStub;
    global.window = { DOCUMENT_API_BASE_URL: 'http://api.test/api/documents' };
    global.fetch = async (url) => {
        requests.push(url);
        const data = url.endsWith('/categories')
            ? ['Finance', 'Human Resources']
            : sampleDocuments;
        return { ok: true, json: async () => data };
    };

    try {
        const appPath = require.resolve('../public/app');
        delete require.cache[appPath];
        require(appPath);
        await waitForFetch();

        assert.deepEqual(requests, [
            'http://api.test/api/documents',
            'http://api.test/api/documents/categories'
        ]);
        assert.equal(documentStub.elements.get('#loading-message').hidden, true);
        assert.equal(documentStub.elements.get('#document-list').children.length, 2);

        const searchInput = documentStub.elements.get('#search-input');
        const categoryFilter = documentStub.elements.get('#category-filter');
        searchInput.value = 'benefits';
        searchInput.listeners.input();
        assert.equal(documentStub.elements.get('#document-list').children.length, 1);
        assert.match(elementText(documentStub.elements.get('#document-list')), /Benefits Handbook/);

        searchInput.value = '';
        categoryFilter.value = 'Finance';
        categoryFilter.listeners.change();
        assert.equal(documentStub.elements.get('#document-list').children.length, 1);
        assert.match(elementText(documentStub.elements.get('#document-list')), /Quarterly Budget/);

        searchInput.value = 'missing';
        searchInput.listeners.input();
        assert.equal(documentStub.elements.get('#empty-message').hidden, false);
    } finally {
        global.document = previousDocument;
        global.window = previousWindow;
        global.fetch = previousFetch;
    }
});

test('shows an actionable error when the backend cannot be reached', async () => {
    const previousDocument = global.document;
    const previousWindow = global.window;
    const previousFetch = global.fetch;
    const documentStub = createDocumentStub();

    global.document = documentStub;
    global.window = { DOCUMENT_API_BASE_URL: 'http://api.test/api/documents' };
    global.fetch = async () => {
        throw new Error('Backend unavailable');
    };

    try {
        const appPath = require.resolve('../public/app');
        delete require.cache[appPath];
        require(appPath);
        await waitForFetch();

        const errorMessage = documentStub.elements.get('#error-message');
        assert.equal(errorMessage.hidden, false);
        assert.match(errorMessage.textContent, /backend is running/);
        assert.equal(documentStub.elements.get('#loading-message').hidden, true);
    } finally {
        global.document = previousDocument;
        global.window = previousWindow;
        global.fetch = previousFetch;
    }
});
