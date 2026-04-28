const API_BASE = 'http://localhost:3000/api';

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