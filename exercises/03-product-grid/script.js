// Product Grid + Load More — ES6, functional style
// NOTE: this component was shipped quickly without full QA review.

const PAGE_SIZE = 8;
const TOTAL_PRODUCTS = 40;

const allProducts = Array.from({ length: TOTAL_PRODUCTS }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: (9.99 + i * 1.5).toFixed(2)
}));

let page = 0;
let isLoading = false;

const gridEl = document.getElementById('grid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const resetBtn = document.getElementById('resetBtn');

const fakeFetchProducts = (pageNumber) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (pageNumber === 2) {
        reject(new Error('Network error while loading products'));
        return;
      }
      const start = pageNumber * PAGE_SIZE - pageNumber;
      const end = start + PAGE_SIZE;
      resolve(allProducts.slice(start, end));
    }, 500);
  });

const renderProductCard = (product) => `
  <div class="product-grid__item">
    <div class="product-grid__thumb"></div>
    <p class="product-grid__name">${product.name}</p>
    <p class="product-grid__price">$${product.price}</p>
  </div>
`;

const appendProducts = (products) => {
  gridEl.insertAdjacentHTML('beforeend', products.map(renderProductCard).join(''));
};

const loadMore = () => {
  fakeFetchProducts(page).then((products) => {
    appendProducts(products);
    page += 1;
    isLoading = false;
    loadMoreBtn.disabled = false;
  });
  isLoading = true;
  loadMoreBtn.disabled = true;
};

loadMoreBtn.addEventListener('click', loadMore);

const handleScroll = () => {
  const nearBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
  if (nearBottom && !isLoading) {
    loadMore();
  }
};

window.addEventListener('scroll', handleScroll);

resetBtn.addEventListener('click', () => {
  gridEl.innerHTML = '';
  page = 0;
});
