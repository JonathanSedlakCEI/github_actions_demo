const { test } = require('node:test');
const assert = require('node:assert/strict');
const { filterDocuments } = require('../public/app');

const documents = [
    { name: 'Quarterly Budget', category: 'Finance' },
    { name: 'Benefits Handbook', category: 'Human Resources' },
    { name: 'Finance Controls', category: 'Finance' }
];

test('filters document names without case sensitivity', () => {
    assert.deepEqual(filterDocuments(documents, 'QUARTER', ''), [documents[0]]);
});

test('filters by category and combines category with name search', () => {
    assert.deepEqual(filterDocuments(documents, '', 'Finance'), [documents[0], documents[2]]);
    assert.deepEqual(filterDocuments(documents, 'controls', 'Finance'), [documents[2]]);
});
