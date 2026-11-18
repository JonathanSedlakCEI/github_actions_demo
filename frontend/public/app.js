const API_BASE_URL = typeof window !== 'undefined' && window.DOCUMENT_API_BASE_URL
    ? window.DOCUMENT_API_BASE_URL
    : 'http://localhost:5000/api/documents';

function filterDocuments(documents, searchTerm, category) {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
    return documents.filter((document) => {
        const matchesName = document.name.toLocaleLowerCase().includes(normalizedSearch);
        const matchesCategory = !category || document.category === category;
        return matchesName && matchesCategory;
    });
}

function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

function createDocumentCard(documentData) {
    const card = document.createElement('article');
    card.className = 'document-card';

    const topLine = document.createElement('div');
    topLine.className = 'card-topline';

    const fileType = document.createElement('span');
    fileType.className = 'file-type';
    fileType.textContent = documentData.fileType;

    const category = document.createElement('span');
    category.className = 'category-badge';
    category.textContent = documentData.category;

    const name = document.createElement('h3');
    name.textContent = documentData.name;

    const description = document.createElement('p');
    description.className = 'document-description';
    description.textContent = documentData.description;

    const modified = document.createElement('p');
    modified.className = 'document-date';
    modified.textContent = `Last modified ${formatDate(documentData.lastModified)}`;

    topLine.append(fileType, category);
    card.append(topLine, name, description, modified);
    return card;
}

if (typeof module !== 'undefined') {
    module.exports = { filterDocuments };
}

if (typeof document !== 'undefined') {
    const searchInput = document.querySelector('#search-input');
    const categoryFilter = document.querySelector('#category-filter');
    const documentList = document.querySelector('#document-list');
    const resultCount = document.querySelector('#result-count');
    const loadingMessage = document.querySelector('#loading-message');
    const errorMessage = document.querySelector('#error-message');
    const emptyMessage = document.querySelector('#empty-message');
    let documents = [];

    function renderDocuments() {
        const visibleDocuments = filterDocuments(
            documents,
            searchInput.value,
            categoryFilter.value
        );

        documentList.replaceChildren(...visibleDocuments.map(createDocumentCard));
        resultCount.textContent = `${visibleDocuments.length} ${visibleDocuments.length === 1 ? 'document' : 'documents'}`;
        emptyMessage.hidden = visibleDocuments.length !== 0;
    }

    async function loadDocuments() {
        try {
            const [documentsResponse, categoriesResponse] = await Promise.all([
                fetch(API_BASE_URL),
                fetch(`${API_BASE_URL}/categories`)
            ]);

            if (!documentsResponse.ok || !categoriesResponse.ok) {
                throw new Error('The document service returned an unexpected response.');
            }

            const [loadedDocuments, categories] = await Promise.all([
                documentsResponse.json(),
                categoriesResponse.json()
            ]);

            documents = loadedDocuments;
            for (const category of categories) {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.append(option);
            }

            renderDocuments();
        } catch (error) {
            errorMessage.textContent = 'Documents could not be loaded. Check that the backend is running and try again.';
            errorMessage.hidden = false;
        } finally {
            loadingMessage.hidden = true;
        }
    }

    searchInput.addEventListener('input', renderDocuments);
    categoryFilter.addEventListener('change', renderDocuments);
    loadDocuments();
}
