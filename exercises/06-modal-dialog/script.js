// Modal Dialog — ES6, functional style
// NOTE: this component was shipped quickly without full QA review.

const modalEl = document.getElementById('modal');
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.getElementById('closeModalBtn');
const overlayEl = modalEl.querySelector('.modal__overlay');

const openModal = () => {
  modalEl.hidden = false;
};

const closeModal = () => {
  modalEl.hidden = true;
};

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
overlayEl.addEventListener('click', closeModal);

