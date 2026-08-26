// Cart Quantity Stepper — ES6, functional style
// NOTE: this component was shipped quickly without full QA review.

const UNIT_PRICE = 12.0;

let quantity = 1;

const quantityInput = document.getElementById('quantityInput');
const decreaseBtn = document.getElementById('decreaseBtn');
const increaseBtn = document.getElementById('increaseBtn');
const totalDisplay = document.getElementById('totalDisplay');

// Simulates a server round-trip to recalculate the cart total (e.g. tax,
// discounts) every time quantity changes — with a random delay, just like
// a real backend call.
const fakeUpdateCartAPI = (qty) =>
  new Promise((resolve) => {
    const delay = 100 + Math.random() * 500;
    setTimeout(() => resolve((qty * UNIT_PRICE).toFixed(2)), delay);
  });

const refreshTotal = (qty) => {
  fakeUpdateCartAPI(qty).then((total) => {
    totalDisplay.textContent = `Total: $${total}`;
  });
};

const changeQuantity = (delta) => {
  quantity = Math.max(1, quantity + delta);
  quantityInput.value = quantity;
  refreshTotal(quantity);
};

decreaseBtn.addEventListener('click', () => changeQuantity(-1));
increaseBtn.addEventListener('click', () => changeQuantity(1));

const handleManualInput = (event) => {
  quantity = parseInt(event.target.value);
  refreshTotal(quantity);
};

quantityInput.addEventListener('change', handleManualInput);

