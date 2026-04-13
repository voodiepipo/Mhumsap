/* ==========================================================
   product-detail.js — Product Detail Page
   Reads ?id= from URL, fetches from API, populates DOM
   Shows: image, category, name, description, price,
          rating stars, stock badge, order button
   ========================================================== */

const API_BASE = 'http://localhost:3000/api';

/* ----------------------------------------------------------
   UTILITY: render filled + empty stars (e.g. ★★★★☆)
   ---------------------------------------------------------- */
function renderStars(rating) {
  if (rating === null || rating === undefined) return '<span class="no-rating">No rating yet</span>';
  const r     = parseFloat(rating);
  const full  = Math.floor(r);
  const half  = r - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    '<span class="rating-stars" aria-label="Rating: ' + r.toFixed(1) + ' out of 5">' +
    '<span class="star filled">★</span>'.repeat(full) +
    (half ? '<span class="star half">★</span>' : '') +
    '<span class="star empty">☆</span>'.repeat(empty) +
    '</span>' +
    `<span class="rating-value">${r.toFixed(1)} / 5</span>`
  );
}

/* ----------------------------------------------------------
   UTILITY: stock availability
   ---------------------------------------------------------- */
function renderStock(stock) {
  const s = parseInt(stock) || 0;
  if (s === 0)  return '<span class="stock-pill out">Out of Stock</span>';
  if (s <= 5)   return `<span class="stock-pill low">Only ${s} left!</span>`;
  return              `<span class="stock-pill in">In Stock (${s})</span>`;
}

/* ----------------------------------------------------------
   Load and display product
   ---------------------------------------------------------- */
async function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');

  const elLoading = document.getElementById('detailLoading');
  const elContent = document.getElementById('detailContent');
  const elError   = document.getElementById('detailError');

  if (!id || isNaN(parseInt(id))) {
    elLoading.style.display = 'none';
    elError.style.display   = 'flex';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/products/${id}`);

    if (res.status === 404) {
      elLoading.style.display = 'none';
      elError.style.display   = 'flex';
      return;
    }
    if (!res.ok) throw new Error(`Server error ${res.status}`);

    const p = await res.json();

    // Update page title
    document.title = `Mhumsap – ${p.name}`;

    // Populate image
    const imgEl = document.getElementById('detailImg');
    imgEl.src   = p.image_url || '../images/placeholder-upload.png';
    imgEl.alt   = p.name;

    // Text fields
    document.getElementById('detailCategory').textContent   = p.category || '';
    document.getElementById('detailName').textContent       = p.name;
    document.getElementById('detailId').textContent         = `Product ID: ${p.id}`;
    document.getElementById('detailDescription').textContent =
      p.description || 'No description available.';
    document.getElementById('detailPrice').textContent      =
      `${Number(p.price).toFixed(2)} THB`;

    // Rating stars
    document.getElementById('detailRating').innerHTML = renderStars(p.rating);

    // Stock badge
    document.getElementById('detailStock').innerHTML  = renderStock(p.stock);

    // Show content
    elLoading.style.display = 'none';
    elContent.style.display = 'block';

  } catch (err) {
    elLoading.style.display = 'none';
    elError.style.display   = 'flex';
    console.error('product-detail.js error:', err);
  }
}

/* ----------------------------------------------------------
   Order button
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  loadDetail();

  const orderBtn = document.getElementById('orderBtn');
  if (orderBtn) {
    orderBtn.addEventListener('click', () => {
      alert('Order functionality coming soon!');
    });
  }
});
