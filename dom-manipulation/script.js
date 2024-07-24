// Initial array of quotes
const quotes = [
    { text: "When you change your thoughts, remember to also change your world.", category: "Motivation" },
    { text: "Education is the most powerful weapon which you can use to change the world.", category: "students" },
    { text: "Experience is a hard teacher because she gives the test first, the lesson afterward.", category: "Life" }
];

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
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.addEventListener('DOMContentLoaded', () => {
    showRandomQuote(); // Display an initial quote
    createAddQuoteForm(); // Create the form for adding new quotes
});
