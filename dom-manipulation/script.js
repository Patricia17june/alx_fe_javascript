// Initial array of quotes loaded from local storage or default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "When you change your thoughts, remember to also change your world.", category: "Motivation" },
    { text: "Education is the most powerful weapon which you can use to change the world.", category: "students" },
    { text: "Experience is a hard teacher because she gives the test first, the lesson afterward.", category: "Life" }
];

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    populateCategoryFilter(); // Update category filter when quotes change
}

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    displayQuote(randomQuote);
    // Save the last viewed quote to session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Function to display a quote
function displayQuote(quote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';

    const quoteText = document.createElement('p');
    quoteText.textContent = quote.text;

    const quoteCategory = document.createElement('p');
    quoteCategory.textContent = quote.category;
    quoteCategory.style.fontStyle = 'italic';

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
}

// Function to create the form for adding new quotes
function createAddQuoteForm() {
    const quoteFormContainer = document.getElementById('quoteFormContainer');
    quoteFormContainer.innerHTML = '';

    const formDiv = document.createElement('div');

    const inputQuote = document.createElement('input');
    inputQuote.id = 'newQuoteText';
    inputQuote.type = 'text';
    inputQuote.placeholder = 'Enter a new quote';

    const inputCategory = document.createElement('input');
    inputCategory.id = 'newQuoteCategory';
    inputCategory.type = 'text';
    inputCategory.placeholder = 'Enter quote category';

    const addButton = document.createElement('button');
    addButton.id = 'addQuoteBtn';
    addButton.textContent = 'Add Quote';

    formDiv.appendChild(inputQuote);
    formDiv.appendChild(inputCategory);
    formDiv.appendChild(addButton);
    quoteFormContainer.appendChild(formDiv);

    addButton.addEventListener('click', addQuote);
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText === '' || newQuoteCategory === '') {
        alert('Please enter both a quote and a category.');
        return;
    }

    const newQuote = {
        text: newQuoteText,
        category: newQuoteCategory
    };

    quotes.push(newQuote);
    saveQuotes();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    link.click();

    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to populate category filter
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    const categories = [...new Set(quotes.map(quote => quote.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category filter from local storage
    const lastSelectedCategory = localStorage.getItem('selectedCategory');
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
    }
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', selectedCategory);

    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    if (filteredQuotes.length > 0) {
        displayQuote(filteredQuotes[0]);
    } else {
        document.getElementById('quoteDisplay').innerHTML = '<p>No quotes available for this category.</p>';
    }
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
document.addEventListener('DOMContentLoaded', () => {
    showRandomQuote(); // Display an initial quote
    createAddQuoteForm(); // Create the form for adding new quotes
    populateCategoryFilter(); // Populate category filter

    // Display the last viewed quote from session storage if it exists
    const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
    if (lastViewedQuote) {
        displayQuote(lastViewedQuote);
    }
});
