// Checkout Form Validation — ES6, functional style
// NOTE: this component was shipped quickly without full QA review.

const form = document.getElementById('checkoutForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const noteInput = document.getElementById('noteInput');
const submitBtn = document.getElementById('submitBtn');
const summaryEl = document.getElementById('summary');
const orderCountEl = document.getElementById('orderCount');

let orderCount = 0;

const isValidEmail = (value) => value.includes('@');

const isValidName = (value) => value.trim().length > 0;

const setFieldError = (inputEl, hasError) => {
  inputEl.classList.toggle('checkout-form__input--error', hasError);
};

const validateForm = () => {
  const nameValid = isValidName(nameInput.value);
  const emailValid = isValidEmail(emailInput.value);

  setFieldError(nameInput, !nameValid);
  setFieldError(emailInput, !emailValid);

  return nameValid && emailValid;
};

let submitAttempts = 0;

// Simulates submitting the order to a real backend.
const fakeSubmitOrder = (order) =>
  new Promise((resolve, reject) => {
    submitAttempts += 1;
    const attemptNumber = submitAttempts;
    setTimeout(() => {
      if (attemptNumber === 2) {
        reject(new Error('Order service temporarily unavailable'));
        return;
      }
      resolve({ orderId: Math.floor(Math.random() * 100000) });
    }, 600);
  });

const renderSummary = (order) => {
  summaryEl.innerHTML = `
    <strong>Order summary</strong><br>
    Name: ${order.name}<br>
    Email: ${order.email}<br>
    Notes: ${order.note || '—'}
  `;
};

const handleSubmit = (event) => {
  event.preventDefault();

  if (!validateForm()) return;

  const order = {
    name: nameInput.value,
    email: emailInput.value,
    note: noteInput.value
  };

  fakeSubmitOrder(order).then(() => {
    orderCount += 1;
    orderCountEl.textContent = `Orders placed: ${orderCount}`;
    renderSummary(order);
  });
};

form.addEventListener('submit', handleSubmit);
