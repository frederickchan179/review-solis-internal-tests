// Product Variant Selector — ES6, functional style
// NOTE: this component was shipped quickly without full QA review.

const variants = [
  { id: 'v1', color: 'White', size: 'S', price: '1999', available: true },
  { id: 'v2', color: 'White', size: 'M', price: '1999', available: true },
  { id: 'v3', color: 'White', size: 'L', price: '2199', available: false },
  { id: 'v4', color: 'Navy', size: 'S', price: '2099', available: true },
  { id: 'v5', color: 'Navy', size: 'M', price: '2099', available: false },
  { id: 'v6', color: 'Navy', size: 'L', price: '2299', available: false }
];

const colors = [...new Set(variants.map((v) => v.color))];
const sizes = [...new Set(variants.map((v) => v.size))];

let selectedColor = colors[0];
let selectedSize = sizes[0];

const colorOptionsEl = document.getElementById('colorOptions');
const sizeOptionsEl = document.getElementById('sizeOptions');
const priceEl = document.getElementById('price');
const stockMsgEl = document.getElementById('stockMsg');
const addToCartBtn = document.getElementById('addToCartBtn');
const cartMsgEl = document.getElementById('cartMsg');

const findVariant = (color, size) =>
  variants.find((v) => v.color === color && v.size === size);

const formatPrice = (cents) => `$${(Number(cents) / 100).toFixed(2)}`;

const renderColorOptions = () => {
  colorOptionsEl.innerHTML = colors
    .map(
      (color) => `
      <button
        class="variant-selector__option ${color === selectedColor ? 'variant-selector__option--selected' : ''}"
        data-color="${color}"
      >${color}</button>`
    )
    .join('');
};

const renderSizeOptions = () => {
  sizeOptionsEl.innerHTML = sizes
    .map(
      (size) => `
      <button
        class="variant-selector__option ${size === selectedSize ? 'variant-selector__option--selected' : ''}"
        data-size="${size}"
      >${size}</button>`
    )
    .join('');
};

const renderSelection = () => {
  const variant = findVariant(selectedColor, selectedSize);

  if (!variant) {
    return;
  }

  priceEl.textContent = formatPrice(variant.price);
  stockMsgEl.textContent = variant.available ? 'In stock' : 'Out of stock';

  addToCartBtn.disabled = false;
};

const handleOptionClick = (event) => {
  const colorBtn = event.target.closest('[data-color]');
  const sizeBtn = event.target.closest('[data-size]');

  if (colorBtn) selectedColor = colorBtn.dataset.color;
  if (sizeBtn) selectedSize = sizeBtn.dataset.size;

  renderColorOptions();
  renderSizeOptions();
  renderSelection();
};

const handleAddToCart = () => {
  const variant = findVariant(selectedColor, selectedSize);
  cartMsgEl.textContent = `Added ${selectedColor} / ${selectedSize} — ${variant.price.toFixed(2)} to cart!`;
};

document.getElementById('variantSelector').addEventListener('click', (event) => {
  if (event.target === addToCartBtn) {
    handleAddToCart();
  } else {
    handleOptionClick(event);
  }
});

renderColorOptions();
renderSizeOptions();
renderSelection();
