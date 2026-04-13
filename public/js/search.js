/* ==========================================================
   search.js — Search & Filter Page
   Calls GET /api/products?search=&category=
   Updates the food grid in real-time
   ========================================================== */

const API_BASE = 'http://localhost:3000/api';

let debounceTimer = null;

/* ----------------------------------------------------------
   Fetch and render search results
   ---------------------------------------------------------- */
async function searchProducts() {
  const q        = document.getElementById('searchInput').value.trim();
  const category = document.getElementById('categoryFilter').value;

  const grid    = document.getElementById('searchGrid');
  const empty   = document.getElementById('searchEmpty');
  const loading = document.getElementById('searchLoading');
  const count   = document.getElementById('resultsCount');

  // Show loading spinner
  grid.innerHTML       = '';
  grid.appendChild(loading);
  loading.style.display = 'flex';
  empty.style.display   = 'none';
  count.textContent     = '';

  try {
    // Build query string
    const params = new URLSearchParams();
    if (q)        params.set('search',   q);
    if (category) params.set('category', category);

    const url = `${API_BASE}/products${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Server error ${res.status}`);

    const products = await res.json();

    loading.style.display = 'none';

    // Update result count
    count.textContent = products.length === 0
      ? 'No results'
      : `${products.length} result${products.length !== 1 ? 's' : ''}`;

    if (products.length === 0) {
      empty.style.display = 'block';
      return;
    }

    // Render cards
    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'food-card';

      card.innerHTML = `
        <a href="product-detail.html?id=${p.id}" class="card-link" aria-label="View ${p.name}">
          <img
            src="${p.image_url || '../images/placeholder-upload.png'}"
            alt="${p.name}"
            loading="lazy"
            onerror="this.src='../images/placeholder-upload.png'"
          >
          <div class="card-body">
            <p class="country">${p.category || ''}</p>
            <p class="food-name">${p.name}</p>
            <p class="price">${Number(p.price).toFixed(2)} THB</p>
          </div>
        </a>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    loading.style.display = 'none';
    grid.innerHTML = `
      <p class="search-empty" style="display:block">
        ⚠️ Could not connect to the server at <code>${API_BASE}</code>.<br>
        Please make sure the server is running.
      </p>
    `;
    count.textContent = '';
    console.error('search.js error:', err);
  }
}

/* ----------------------------------------------------------
   Event listeners
   ---------------------------------------------------------- */

// Debounced live search as user types
document.getElementById('searchInput').addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(searchProducts, 350);
});

// Instant filter when category changes
document.getElementById('categoryFilter').addEventListener('change', searchProducts);

// Manual search button
document.getElementById('searchBtn').addEventListener('click', searchProducts);

// Submit on Enter key inside search input
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    clearTimeout(debounceTimer);
    searchProducts();
  }
});

/* ----------------------------------------------------------
   Initialize — load all products on page open
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', searchProducts);
