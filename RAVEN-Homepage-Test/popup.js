// Sample listings data
const listingsData = {
  all: [
    {
      id: 1,
      image: 'images/nike-matcha-1.jpg',
      price: 125.00,
      title: "Nike SB Dunk Low 'Matcha'"
    },
    {
      id: 2,
      image: 'images/nike-matcha-2.jpg',
      price: 159.00,
      title: "Nike SB Matcha"
    },
    {
      id: 3,
      image: 'images/nike-matcha-3.jpg',
      price: 139.00,
      title: "Nike SB Dunks"
    }
  ],
  craigslist: [
    {
      id: 1,
      image: 'images/nike-matcha-1.jpg',
      price: 125.00,
      title: "Nike SB Dunk Low 'Matcha'"
    }
  ],
  ebay: [
    {
      id: 2,
      image: 'images/nike-matcha-2.jpg',
      price: 159.00,
      title: "Nike SB Matcha"
    },
    {
      id: 3,
      image: 'images/nike-matcha-3.jpg',
      price: 139.00,
      title: "Nike SB Dunks"
    }
  ]
};

let currentTab = 'all';

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  renderListings(currentTab);
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Tab switching
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      renderListings(currentTab);
      updateStats(currentTab);
    });
  });

  // Close button
  document.getElementById('closeBtn').addEventListener('click', () => {
    window.close();
  });

  // View all button
  document.getElementById('viewAllBtn').addEventListener('click', () => {
    console.log('[v0] View all listings clicked');
    // Open full listings page or external link
    // chrome.tabs.create({ url: 'listings.html' });
  });
}

// Render listings based on active tab
function renderListings(tab) {
  const container = document.getElementById('listingsContainer');
  const listings = listingsData[tab] || [];

  container.innerHTML = '';

  listings.forEach(listing => {
    const listingEl = document.createElement('div');
    listingEl.className = 'listing-item';
    listingEl.innerHTML = `
      <img src="${listing.image}" alt="${listing.title}" class="listing-image" onerror="this.src='images/placeholder.jpg'">
      <div class="listing-info">
        <div class="listing-price">$${listing.price.toFixed(2)}</div>
        <div class="listing-title">${listing.title}</div>
      </div>
    `;
    
    listingEl.addEventListener('click', () => {
      console.log('[v0] Listing clicked:', listing.title);
      // Open listing in new tab or show details
    });

    container.appendChild(listingEl);
  });
}

// Update stats based on active tab
function updateStats(tab) {
  const listings = listingsData[tab] || [];
  const count = listings.length;
  const avgPrice = listings.length > 0 
    ? listings.reduce((sum, item) => sum + item.price, 0) / listings.length 
    : 0;

  document.getElementById('listingsCount').textContent = count;
  document.getElementById('avgPrice').textContent = `$${avgPrice.toFixed(2)}`;
}
