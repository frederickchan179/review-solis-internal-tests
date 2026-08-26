// Accordion — ES6, functional style
// NOTE: this component was shipped quickly without full QA review.

const faqItems = [
  {
    id: 'shipping',
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-5 business days within the country. Express shipping takes 1-2 business days. During holiday seasons, please allow an extra 2-3 days for processing before your order ships out.'
  },
  {
    id: 'returns',
    question: 'What is your return policy?',
    answer: 'We accept returns within 30 days of purchase.'
  },
  {
    id: 'sizing',
    question: 'How do I find my size?',
    answer: 'Check our size guide linked on every product page. If you are between sizes, we recommend sizing up. You can also <a href="#">chat with support</a> for a personalized recommendation.'
  },
  {
    id: 'payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept Visa, Mastercard, and PayPal.'
  }
];

let openIndex = null;

const accordionEl = document.getElementById('accordion');
const filterEl = document.querySelector('.accordion__filter');

const renderAccordion = (items) => {
  accordionEl.innerHTML = items
    .map(
      (item, index) => `
      <div class="accordion__item">
        <h3 class="accordion__header">
          <button
            class="accordion__button"
            aria-expanded="${index === openIndex}"
            data-index="${index}"
          >
            ${item.question}
            <span class="accordion__icon">+</span>
          </button>
        </h3>
        <div class="accordion__panel ${index === openIndex ? 'accordion__panel--open' : ''}">
          <div class="accordion__panel-inner">${item.answer}</div>
        </div>
      </div>`
    )
    .join('');

  accordionEl.querySelectorAll('.accordion__button').forEach((btn) => {
    btn.addEventListener('click', () => handleToggle(Number(btn.dataset.index)));
  });
};

const handleToggle = (index) => {
  openIndex = openIndex === index ? null : index;
  renderAccordion(getFilteredItems());
};

const getFilteredItems = () => {
  const query = filterEl.value;
  return faqItems.filter((item) => item.question.includes(query));
};

filterEl.addEventListener('input', () => {
  renderAccordion(getFilteredItems());
});

renderAccordion(faqItems);
