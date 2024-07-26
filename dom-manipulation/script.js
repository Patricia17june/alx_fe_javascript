let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "When you change your thoughts, remember to also change your world.", category: "Motivation" },
    { text: "Education is the most powerful weapon which you can use to change the world.", category: "students" },
    { text: "Experience is a hard teacher because she gives the test first, the lesson afterward.", category: "Life" }
];

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();
    return serverQuotes.map(quote => ({
        text: quote.title,
        category: 'Server'
    }));
}

// Function to post quotes to the server
async function postQuoteToServer(quote) {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: quote.text,
            body: quote.category,
            userId: 1
        })
    });
}

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';

    const quoteText = document.createElement('p');
    quoteText.textContent = randomQuote.text;

    const quoteCategory = document.createElement('p');
    quoteCategory.textContent = randomQuote.category;
    quoteCategory.style.fontStyle = 'italic';

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);

    // Save the last viewed quote to session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
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
async function addQuote() {
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
    await postQuoteToServer(newQuote); // Post new quote to the server
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

// Function to populate categories dynamically
function populateCategories() {
    const categories = Array.from(new Set(quotes.map(q => q.category)));
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';

    filteredQuotes.forEach(quote => {
        const quoteText = document.createElement('p');
        quoteText.textContent = quote.text;

        const quoteCategory = document.createElement('p');
        quoteCategory.textContent = quote.category;
        quoteCategory.style.fontStyle = 'italic';

        quoteDisplay.appendChild(quoteText);
        quoteDisplay.appendChild(quoteCategory);
    });
}

// Function to notify user
function notifyUser(message) {
    alert(message);
}

// Function to sync quotes with the server
async function syncQuotesWithServer() {
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

    const combinedQuotes = [...serverQuotes, ...localQuotes];
    const uniqueQuotes = combinedQuotes.filter((quote, index, self) =>
        index === self.findIndex(q => q.text === quote.text)
    );

    if (JSON.stringify(uniqueQuotes) !== JSON.stringify(localQuotes)) {
        localStorage.setItem('quotes', JSON.stringify(uniqueQuotes));
        quotes = uniqueQuotes;
        notifyUser('Data has been updated from the server.');
    }
}

// Sync every minute
setInterval(syncQuotesWithServer, 60000);

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
document.addEventListener('DOMContentLoaded', () => {
    showRandomQuote(); // Display an initial quote
    createAddQuoteForm(); // Create the form for adding new quotes
    populateCategories(); // Populate categories dynamically

    // Display the last viewed quote from session storage if it exists
    const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
    if (lastViewedQuote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `
            <p>${lastViewedQuote.text}</p>
            <p><em>${lastViewedQuote.category}</em></p>
        `;
    }
});
