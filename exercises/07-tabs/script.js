// Tabs — ES6, functional style
// NOTE: this component was shipped quickly without full QA review.

const tabListEl = document.getElementById('tabList');
const tabPanelEl = document.getElementById('tabPanel');

let tabs = [];
let activeIndex = 0;
const contentCache = {};

// Simulates loading the tab configuration from a CMS/API.
const fakeFetchTabs = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'description', label: 'Description', isDefault: false },
        { id: 'sizing', label: 'Sizing', isDefault: true },
        { id: 'shipping', label: 'Shipping & Returns', isDefault: false },
        { id: 'reviews', label: 'Reviews', isDefault: false }
      ]);
    }, 300);
  });

// Simulates fetching the (possibly heavy) content for one tab from the
// server, with its own delay each time.
const fakeFetchTabContent = (tabId) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const content = {
        description: '100% organic cotton, pre-shrunk, gentle on sensitive skin.',
        sizing: 'True to size. See our size chart for exact measurements.',
        shipping: 'Ships within 2 business days. Free returns within 30 days.',
        reviews: '4.8 out of 5 stars, based on 213 reviews.'
      };
      resolve(content[tabId]);
    }, 400);
  });

const renderTabList = () => {
  tabListEl.innerHTML = tabs
    .map(
      (tab, index) => `
      <button
        class="tabs__tab ${index === activeIndex ? 'tabs__tab--active' : ''}"
        role="tab"
        aria-selected="${index === activeIndex}"
        data-index="${index}"
      >${tab.label}</button>`
    )
    .join('');

  tabListEl.querySelectorAll('.tabs__tab').forEach((btn) => {
    btn.addEventListener('click', () => selectTab(Number(btn.dataset.index)));
  });

};

const selectTab = (index) => {
  activeIndex = index;
  renderTabList();
  tabPanelEl.textContent = 'Loading...';
  fakeFetchTabContent(tabs[index].id).then((content) => {
    tabPanelEl.textContent = content;
  });
};

const init = async () => {
  tabs = await fakeFetchTabs();
  selectTab(activeIndex);
};

init();
