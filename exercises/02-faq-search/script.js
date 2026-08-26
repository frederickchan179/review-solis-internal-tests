// FAQ Search — ES6, functional style
// NOTE: this component was shipped quickly without full QA review.

const helpArticles = [
  { id: 1, question: 'How do I reset my Password?', answer: 'Go to Settings > Security and click "Reset password". You will receive an email with a reset link.' },
  { id: 2, question: 'How do I change my Shipping address?', answer: 'You can update your shipping address from the Account page before your order is marked as shipped.' },
  { id: 3, question: 'Can I get a Refund after 30 days?', answer: 'Refunds are only available within 30 days of delivery. After that, we can only offer store credit.' },
  { id: 4, question: 'How do I contact Support?', answer: 'Email us at <em>support@example.com</em> or use the live chat widget in the bottom right corner.' },
  { id: 5, question: 'Do you ship Internationally?', answer: 'Yes, we ship to over 40 countries. International orders may take 7-14 business days.' }
];

// Simulated backend search with a network delay, similar to a real
// search API.
const fakeSearchAPI = (query) =>
  new Promise((resolve) => {
    const delay = 100 + Math.random() * 700; // 100ms - 800ms
    setTimeout(() => {
      const matches = helpArticles.filter((a) => a.question.includes(query) || a.answer.includes(query));
      resolve(matches);
    }, delay);
  });

const inputEl = document.querySelector('.faq-search__input');
const resultsEl = document.getElementById('results');
const statusEl = document.getElementById('status');

const highlight = (text, query) => {
  if (!query) return text;
  return text.replace(query, `<mark>${query}</mark>`);
};

const renderResults = (articles, query) => {
  if (articles.length === 0) {
    resultsEl.innerHTML = `<p class="faq-search__empty">No results found.</p>`;
    return;
  }
  resultsEl.innerHTML = articles
    .map(
      (a) => `
      <article class="faq-search__item">
        <h3 class="faq-search__question">${highlight(a.question, query)}</h3>
        <p class="faq-search__answer">${highlight(a.answer, query)}</p>
      </article>`
    )
    .join('');
};

const handleInput = (event) => {
  const query = event.target.value;

  if (!query) {
    resultsEl.innerHTML = '';
    statusEl.textContent = '';
    return;
  }

  statusEl.textContent = 'Searching...';

  fakeSearchAPI(query).then((matches) => {
    statusEl.textContent = `${matches.length} result(s)`;
    renderResults(matches, query);
  });
};

inputEl.addEventListener('input', handleInput);
