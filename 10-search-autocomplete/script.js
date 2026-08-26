// Search Autocomplete — ES6, functional style
// NOTE: this component was shipped quickly without full QA review.

const catalog = [
  'iPhone 15 Case',
  'iPhone Charger Cable',
  'iPad Screen Protector',
  'Wireless Earbuds',
  'Wireless Charging Pad',
  'Bluetooth Speaker',
  'Laptop Sleeve',
  'USB-C Hub',
  'Phone Ring Holder',
  'Portable Power Bank'
];

const inputEl = document.getElementById('searchInput');
const listEl = document.getElementById('autocompleteList');

let debounceTimer = null;

const fakeFetchSuggestions = (query) =>
  new Promise((resolve) => {
    const delay = 100 + Math.random() * 500; // simulate real, variable network latency
    setTimeout(() => {
      const matches = catalog.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
      resolve(matches);
    }, delay);
  });

const renderSuggestions = (items) => {
  if (items.length === 0) {
    listEl.hidden = true;
    listEl.innerHTML = '';
    return;
  }
  listEl.innerHTML = items
    .map((item) => `<li class="autocomplete__item">${item}</li>`)
    .join('');
  listEl.hidden = false;

  listEl.querySelectorAll('.autocomplete__item').forEach((li) => {
    li.addEventListener('click', () => {
      inputEl.value = li.textContent;
      listEl.hidden = true;
    });
  });
};

const handleInput = (event) => {
  const query = event.target.value;

  if (!query) {
    listEl.hidden = true;
    return;
  }

  debounceTimer = setTimeout(() => {
    fakeFetchSuggestions(query).then(renderSuggestions);
  }, 300);
};

inputEl.addEventListener('input', handleInput);

