const API_BASE = 'http://localhost:3000/api';

async function loadProducts() {
  const grid    = document.getElementById('productGrid');
  const emptyMsg = document.getElementById('emptyMsg');

  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const products = await res.json();

    // Clear skeleton loaders
    grid.innerHTML = '';

    if (products.length === 0) {
      emptyMsg.style.display = 'block';
      return;
    }

    emptyMsg.style.display = 'none';

    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `View details for ${p.name}`);

      card.innerHTML = `
        <img
          class="product-card-img"
          src="${p.image_url || '../images/placeholder-upload.png'}"
          alt="${p.name}"
          loading="lazy"
          onerror="this.src='../images/placeholder-upload.png'"
        >
        <div class="product-card-body">
          <p class="product-card-category">${p.category || ''}</p>
          <p class="product-card-name">${p.name}</p>
          <p class="product-card-price">${Number(p.price).toFixed(2)} THB</p>
        </div>
      `;

      // Navigate to detail page on click or Enter key
      const navigate = () => {
        window.location.href = `product-detail.html?id=${p.id}`;
      };
      card.addEventListener('click', navigate);
      card.addEventListener('keydown', e => { if (e.key === 'Enter') navigate(); });

      grid.appendChild(card);
    });

  } catch (err) {
    grid.innerHTML = `
      <p class="empty-msg">
        ⚠️ Could not load products.<br>
        Make sure the server is running at <code>${API_BASE}</code>
      </p>
    `;
    console.error('home.js error:', err);
  }
}

// Kick off when DOM is ready
document.addEventListener('DOMContentLoaded', loadProducts);
